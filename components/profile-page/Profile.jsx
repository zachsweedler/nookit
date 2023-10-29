"use client";
import Container from "@/styles/Containers";
import { H5, Para } from "@/styles/Typography";
import styled from "styled-components";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";
import NookCard from "../search-nooks/NookCard";

export default function Profile() {
   const supabase = createClientComponentClient();
   const params = useParams();
   const [nooks, setNooks] = useState(null);
   const [profile, setProfile] = useState(null)
   const [locationImages, setLocationImages] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {

      async function fetchNooks () {
         const { data: nooks, error } = await supabase
            .from("nooks")
            .select("id, location_id, user_id, created_at, locations(name, city, state_code)")
            .order("created_at", { ascending: false })
            .eq("status", "listed")
            .eq("profile_id", params.slug);
         if (error) {
            console.log("Error fetching data", error);
         } else if (nooks?.length > 0) {
            console.log('nooks', nooks);
            setNooks(nooks);
            const images = await listLocationImages(nooks);
            console.log('images iuouih', images)
         }
         setLoading(false);
      };

      async function fetchProfile () {
         const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })
            .eq("id", params.slug);
         if (error) {
            console.log("Error fetching data", error);
         } else if (profile?.length > 0) {
            console.log('profile', profile);
            setProfile(profile[0]);
         }
         setLoading(false);
      };

      async function listLocationImages(nooks) {
         const allImages = await Promise.all(
           nooks.map(async (nook) => {
             const { data: images, error } = await supabase.storage
               .from("user-images")
               .list(`${nook.user_id}/locations/${nook.location_id}/location_images`);
             if (error) {
               console.log("Error listing location images", error);
               return [];
             } else {
               const loadedImages = images.map((image) => image.name);
               return loadedImages.map(
                 (image) => `${nook.user_id}/locations/${nook.location_id}/location_images/${image}`
               );
             }
           })
         );
         setLocationImages((prevLocationImages) => [
           ...prevLocationImages,
           ...allImages.flat(),
         ]);
       }

      async function getData () {
         await fetchNooks();
         await fetchProfile();
      }

      getData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params.slug]);

   useEffect(() => {
      // This effect will run whenever locationImages state changes.
      console.log("locationImages", locationImages);
    }, [locationImages]);

   const date = new Date(profile?.created_at);
   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const joinedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

   let profileWebsite = profile?.website?.toString();
   if (profileWebsite && profileWebsite.startsWith("https://")) {
      profileWebsite = profileWebsite.slice(8);
   }

   return (
      <Wrapper>
         <Container size="sm">
            <Content>
               <Header>
                  <DataAvatar>
                     <Image
                        loader={supabaseLoader}
                        alt="data-avatar"
                        src={`user-images/${profile?.logo}`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                     />
                  </DataAvatar>
                  <H5>{profile?.name}</H5>
                  <Para size="textmd" $weight="regular">
                     Joined {joinedDate}
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {profile?.industry}
                  </Para>
                  <a href={`https://${profileWebsite}`} target="_blank">
                     <Para
                        $isLink={true}
                        size="textmd"
                        $weight="regular"
                        color="primary.brand.b600"
                     >
                        {profile?.website}
                     </Para>
                  </a>
               </Header>
               {profile?.about && (
                  <Section>
                     <Para size="textlg" $weight="medium">
                        About
                     </Para>
                     <Para size="textmd" $weight="regular">
                        {profile?.about}
                     </Para>
                  </Section>
               )}
               {nooks?.length > 0 && (
                  <Section>
                     <Para size="textlg" $weight="medium">
                        Nooks
                     </Para>
                     <NooksGrid>
                        {nooks?.map((nook, index) => (
                           <NookCard
                              key={index}
                              id={nook.id}
                              images={locationImages?.filter(
                                 (image) => nook.id === image.split("/")[2]
                              )}
                              name={nook.locations.name}
                              city={nook.locations.city}
                              state={nook.locations.state_code}
                              hostId={nook.id}
                              logo={profile?.logo}
                              hostName={profile?.name}
                           />
                        ))}
                     </NooksGrid>
                  </Section>
               )}
            </Content>
         </Container>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   padding: 120px 0px;
`;

const Content = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 60px;
`;

const Header = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   align-items: center;
   justify-content: center;
`;

const Section = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   align-items: start;
`;

const NooksGrid = styled.div`
   display: grid;
   width: 100%;
   grid-template-columns: 1fr 1fr;
   grid-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 50px;
   }
`;

const DataAvatar = styled.div`
   width: 100px;
   height: 100px;
   border-radius: 100%;
   overflow: hidden;
   position: relative;
`;
