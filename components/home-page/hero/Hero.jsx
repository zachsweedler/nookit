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
   const supabase = createClientComponentClient();

   useEffect(()=>{
      const fetchFeaturedNooks = async () => {
         const {data, error} = await supabase
            .from("nooks")
            .select(`*, company_profiles(user_id, name, logo)`)
            .order('created_at', { ascending: false })
            .eq('status', 'listed');
         if (error) {
            console.log('error gettings nooks', error)
         } else {
            console.log('data', data)
            setNooks(data);
         }
      }
      fetchFeaturedNooks();
   },[supabase])

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
                  <Para size="textlg" $weight="regular" color="primary.brand.b1000">Affordably pop up inside brand aligned store spaces.</Para>
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
            <Marquee speed={15}>
                 {nooks?.map((nook, index)=>(
                     <NookCard
                        homepage={true}
                        key={index}
                        id={nook.id}
                        images={nook?.location_images}
                        name={nook.location_name}
                        city={nook.location_city}
                        state={nook.location_state_code}
                        hostId={nook.company_id}
                        logo={nook.company_profiles.logo}
                        hostCompany={nook.company_profiles.name}
                     />
                 ))} 
            </Marquee>
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   padding: 150px 0px;
   width: 100vw;
   align-items: center;
   justify-content: center;
   flex-direction: column;
   row-gap: 90px;
   text-align: center;
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
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