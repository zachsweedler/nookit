"use client";
import Container from "@/styles/Containers";
import { H5, Para } from "@/styles/Typography";
import styled from "styled-components";
import NookCard from "../search-nooks/NookCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";

export default function Profile() {
   const supabase = createClientComponentClient();
   const params = useParams();
   const [nooks, setNooks] = useState([]);
   const [profile, setProfile] = useState([]);

   useEffect(() => {
      const fetchProfileNooks = async () => {
         const { data, error } = await supabase
            .from("nooks")
            .select(`*`)
            .order("created_at", { ascending: false })
            .eq("status", "listed")
            .eq("profile_id", params.slug);
         if (error) {
            console.log("error getting nooks", error);
         } else {
            console.log("data", data);
            setNooks(data);
         }
      };
      fetchProfileNooks();
   }, [supabase, params.slug]);

   useEffect(() => {
      const fetchProfile = async () => {
         const { data, error } = await supabase
            .from("profiles")
            .select("id, created_at, about, user_id, name, logo, industry, website")
            .eq("id", params.slug);
         if (error) {
            console.log("error getting profile", error);
         } else {
            console.log("data", data);
            setProfile(data[0]);
         }
      };
      fetchProfile();
   }, [supabase, params.slug]);

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
                  <ProfileAvatar>
                     <Image
                        loader={supabaseLoader}
                        alt="profile-avatar"
                        src={`user-images/${profile?.logo}`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                     />
                  </ProfileAvatar>
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
               {nooks.length > 0 && (
                  <Section>
                     <Para size="textlg" $weight="medium">
                        Nooks
                     </Para>
                     <NooksGrid>
                        {nooks?.map((nook, index) => (
                           <NookCard
                              key={index}
                              id={nook.id}
                              images={nook?.location_images}
                              name={nook.location_name}
                              city={nook.location_city}
                              state={nook.location_state_code}
                              hostId={profile.id}
                              logo={profile?.logo}
                              hostProfile={profile?.name}
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

const ProfileAvatar = styled.div`
   width: 100px;
   height: 100px;
   border-radius: 100%;
   overflow: hidden;
   position: relative;
`;
