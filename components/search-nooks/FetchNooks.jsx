"use client";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NookCard from "./NookCard";
import { styled } from "styled-components";
import Loading from "../loading/Loading";
import EmptyState from "../empty-state/EmptyState";

export default function FetchNooks() {
   const [nooks, setNooks] = useState([]);
   const [locationImages, setLocationImages] = useState([]);
   const supabase = createClientComponentClient();
   const [loading, setLoading] = useState();

   useEffect(() => {
      (async () => {
         setLoading(true);

         // Fetch nooks
         const fetchedNooks = await fetchNooks();
         if (fetchedNooks?.length > 0) {
            // Fetch location images
            await listLocationImages(fetchedNooks);
         }
         setLoading(false);
      })();

      async function fetchNooks() {
         const { data, error } = await supabase
            .from("nooks")
            .select(`*, locations(*), profiles(user_id, name, logo)`)
            .order("created_at", { ascending: false })
            .eq("status", "listed");
         if (error) {
            console.error("error fetching nooks", error);
            return [];
         } else {
            setNooks(data);
            console.log("nooks", data);
            return data;
         }
      }

      async function listLocationImages(nooks) {
         const allImages = await Promise.all(
            nooks.map(async (nook) => {
               const { data: images, error } = await supabase.storage
                  .from("user-images")
                  .list(`${nook.user_id}/nooks/${nook.id}/space`);
               if (error) {
                  console.log("error listing location images", error);
                  return [];
               } else {
                  const loadedImages = images.map((image) => image.name);
                  return loadedImages.map(
                     (image) =>
                        `${nook.user_id}/nooks/${nook.id}/space/${image}`
                  );
               }
            })
         );
         setLocationImages((prevLocationImages) => [
            ...prevLocationImages,
            ...allImages.flat(),
         ]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Container size="xl" style={{ marginTop: "90px" }}>
         {loading ? (
            <CenterWrapper>
               <Loading />
            </CenterWrapper>
         ) : nooks && nooks.length > 0 ? (
            <Grid>
               {nooks.map((nook, index) => (
                  <NookCard
                     key={index}
                     id={nook.id}
                     images={locationImages.filter(image => nook.id === image.split('/')[2])}
                     name={nook.locations.name}
                     city={nook.locations.city}
                     state={nook.locations.state_code}
                     hostId={nook.profile_id}
                     logo={nook.profiles.logo}
                     hostProfile={nook.profiles.name}
                  />
               ))}
            </Grid>
         ) : (
            <CenterWrapper>
               <EmptyState
                  title="No Nooks Found"
                  description="Looks like there are no nooks! Interested in hosting one at your store? Click the link below:"
                  button="Host a Nook"
                  buttonHref="/my-nooks"
               />
            </CenterWrapper>
         )}
      </Container>
   );
}

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   flex-direction: column;
   grid-column-gap: 30px;
   grid-row-gap: 60px;
   padding-bottom: 60px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 40px;
   }
`;

const CenterWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   height: calc(100vh - 300px);
`;
