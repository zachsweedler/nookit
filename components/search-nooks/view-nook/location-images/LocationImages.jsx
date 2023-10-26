"use client";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { Button } from "@/styles/Buttons";
import ImageGallery from "@/components/image-gallery/ImageGallery";
import { useState } from "react";

export default function LocationImages() {
   const nook = useSelector((state) => state.viewNook.nook);
   const [open, setOpen] = useState(false);

   function closeModal() {
      setOpen(false);
   }

   const onButtonClick = () => {
      setOpen(true)
   }

   return (
      <>
      <LocationGrid>
         <LocationGridCover onClick={()=>setOpen(true)}>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[0]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridCover>
         <LocationGridTopRight onClick={()=>setOpen(true)}>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[1]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridTopRight>
         <LocationGridTopLeft onClick={()=>setOpen(true)}>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[2]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridTopLeft>
         <LocationGridBottomLeft onClick={()=>setOpen(true)}>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook?.location_images?.[3]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridBottomLeft>
         <LocationGridBottomRight onClick={()=>setOpen(true)}>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`/user-images/${nook.location_images?.[4]}`}
               fill={true}
               style={{ objectFit: "cover" }}
            />
         </LocationGridBottomRight>
         <ViewPhotosButton $whitecolor={true} onClick={onButtonClick}>View All Photos</ViewPhotosButton>
      </LocationGrid>
      <ImageGallery isOpen={open} onRequestClose={closeModal} locationImages={nook.location_images} nookImages={nook.images}/>
      </>
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
   max-width: ${({ theme }) => theme.container.xl};
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
   border-radius: 12px;
   overflow: hidden;
   &:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.159);
      z-index: 1; 
   }
   &:hover {
      cursor: pointer;
   }
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
   &:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.159);
      z-index: 1; 
   }
   &:hover {
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const LocationGridTopRight = styled.div`
   grid-column:4;
   grid-row: 1;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
   &:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.159);
      z-index: 1; 
   }
   &:hover {
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;


const LocationGridBottomLeft = styled.div`
   grid-column: 3;
   grid-row: 2;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
   &:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.159);
      z-index: 1; 
   }
   &:hover {
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const LocationGridBottomRight = styled.div`
   grid-column: 4;
   grid-row: 2;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
   border-radius: 12px;
   &:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.159);
      z-index: 1; 
   }
   &:hover {
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;


const ViewPhotosButton = styled(Button)`
   position: absolute;
   bottom: 20px;
   right: 20px;
   width: auto;
   z-index: 100;
   background-color: white;
   color: black;
   padding: 12px;
`