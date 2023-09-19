"use client";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

export default function LocationImages() {
   const nook = useSelector((state) => state.viewNook.nook);

   return (
      <LocationGrid>
         <LocationGridCover>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[0]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridCover>
         <LocationGridTopRight>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[1]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridTopRight>
         <LocationGridTopLeft>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[2]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridTopLeft>
         <LocationGridBottomLeft>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[3]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridBottomLeft>
         <LocationGridBottomRight>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook.location_images?.[4]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridBottomRight>
      </LocationGrid>
   );
}

const LocationGrid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr 1fr;
   grid-template-rows: 1fr 1fr;
   grid-gap: 12px;
   height: 100%;
   position: relative;
   overflow: hidden; 
   height: 65vh;
   width: 100%;
   margin: auto;
   margin-top: 90px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 100px;
      height: 400px;
      border-radius: 0px;
   }
`;

const LocationGridCover = styled.div`
   display: flex;
   position: relative;
   grid-column: 1 / span 2;
   grid-row: 1 / span 2;
   border-radius: 0px 12px 12px 0px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      border-radius: 0px;
   }
`;

const LocationGridTopLeft = styled.div`
   grid-column: 3;
   grid-row: 1;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const LocationGridTopRight = styled.div`
   grid-column:4;
   grid-row: 1;
   position: relative;
   border-radius: 12px 0px 0px 12px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;


const LocationGridBottomLeft = styled.div`
   grid-column: 3;
   grid-row: 2;
   position: relative;
   border-radius: 5px;
   border-radius: 12px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const LocationGridBottomRight = styled.div`
   grid-column: 4;
   grid-row: 2;
   position: relative;
   border-radius: 5px;
   overflow: hidden;
   border-radius: 12px 0px 0px 12px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;
