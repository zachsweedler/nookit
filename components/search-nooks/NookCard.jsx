"use client";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import ImageSliderCard from "../image-slider/card/ImageSliderCard";
import supabaseLoader from "@/supabase-image-loader";
import Link from "next/link";

export default function NookCard({
   id,
   images,
   name,
   city,
   state,
   hostId,
   hostName,
   logo,
   homepage,
}) {

   return (
      <Wrapper>
         <Link href={`/s/${id}`}>
            <ImageTitleLocation>
               <ImageSliderCard
                  images={images}
                  onArrowsClick={(e) => e.stopPropagation()}
               />
               {!homepage &&
               <TitleWrapper>
                  <Para size="textmd" $weight="semibold" color="black">
                     {name}
                  </Para>
                  <LocationWrapper>
                     <Image
                        alt="location-pin"
                        src="/location-pin-grey.svg"
                        width={15}
                        height={15}
                     />
                     <Para size="textsm" $weight="regular" color="black">
                        {city}, {state}
                     </Para>
                  </LocationWrapper>
               </TitleWrapper>}
            </ImageTitleLocation>
         </Link>
         <HostWrapper>
            <HostLogoWrapper>
               <Image
                  alt=""
                  loader={supabaseLoader}
                  src={`/user-images/${logo}`}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
            </HostLogoWrapper>
            <Link href={`/profiles/${hostId}`}>
               <Para $isLink={true} size={homepage ? "textmd" : "textsm"} $weight="medium" color="black">
                  {hostName}
               </Para>
            </Link>
         </HostWrapper>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;

const ImageTitleLocation = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   &:hover {
      opacity: 90%;
   }
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: start;
   row-gap: 0px;
   width: 100%;
`;

const LocationWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: center;
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
