"use client";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { H1, H2, Para } from "@/styles/Typography";
import { styled } from "styled-components";
import { availableCities } from "@/utils/availableCities";
import Image from "next/image";
import { SelectHero } from "@/styles/SelectHero";
import Marquee from "react-fast-marquee";
import './MarqueeStyles.css'
import NookCard from "@/components/search-nooks/NookCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Hero() {
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
      <>
         <Wrapper>
            <Container size="sm">
               <Content>
                  <H1>
                     Book a nook
                     <br />
                     within a store
                  </H1>
                  <Form>
                     <SelectHero
                        fieldName="city"
                        label="Find Nooks In"
                        options={availableCities}
                        adornment={
                           <Image
                              alt="nook-images"
                              src="/location-pin-grey.svg"
                              width={12}
                              height={16}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                           />
                        }
                     />
                  </Form>
               </Content>
            </Container>
            <Marquee speed={40}>
                 {nooks?.map((nook, index)=>(
                     <NookCard
                        homepage={true}
                        key={index}
                        id={nook.id}
                        images={locationImages.filter(image => nook.id === image.split('/')[2])}
                        name={nook.locations.name}
                        city={nook.locations.city}
                        state={nook.locations.state_code}
                        hostId={nook.profile_id}
                        logo={nook.profiles.logo}
                        hostName={nook.profiles.name}
                     />
                 ))} 
            </Marquee>
            
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   padding: 150px 0px 100px 0px;
   width: 100vw;
   align-items: center;
   justify-content: center;
   flex-direction: column;
   row-gap: 90px;
   text-align: center;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      position: relative;
      transform: translateY(0px);
      padding: 0px;
      width: 100%;
      row-gap: 90px;
      height: auto;
      border-radius: 0px;
      align-items: center;
      padding: 150px 0px 100px 0px;
   }
`;

const Form = styled.div`
   display: flex;
   row-gap: 40px;
   flex-direction: row;
   width: 100%;
   margin: auto;
   max-width: ${({ theme }) => theme.container.xs};
`;

const Content = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      row-gap: 40px;
   }
`