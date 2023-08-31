"use client";
import { useUserId } from "@/hooks/useUserId";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { styled } from "styled-components";
import ImageSliderCard from "../image-slider/card/ImageSliderCard";

export default function NookCard({
   images,
   name,
   city,
   state,
   hostId,
   hostCompany,
}) {
   const userId = useUserId();

   return (
      <Wrapper>
         <ImageSliderCard
            images={images}
            onArrowsClick={(e) => e.stopPropagation()}
         />
         <TitleWrapper>
            <Para size="textmd" weight="medium" color="black">
               {name}
            </Para>
            <Para size="textsm" weight="regular" color="black">
               {city}, {state}
            </Para>
         </TitleWrapper>
         <HostWrapper>
            {userId === hostId ? null : (
               <HostLogoWrapper>
                  <Image
                     alt=""
                     src={`/user-images/${hostId}/company_logo/logo`}
                     fill={true}
                     style={{ objectFit: "cover" }}
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
               </HostLogoWrapper>
            )}
            {userId ===
            hostId ? // <Para size="textsm" weight="medium" color="black">
            //    <Link href="/">Edit Nook</Link>
            // </Para>
            null : (
               <Para size="textsm" weight="medium" color="black">
                  {hostCompany}
               </Para>
            )}
         </HostWrapper>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 0px;
   width: 100%;
`;

const HostWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 9px;
   align-items: center;
   width: 100%;
`;

const HostLogoWrapper = styled.div`
   position: relative;
   height: 25px;
   width: 25px;
   border-radius: 100%;
   overflow: hidden;
`;
