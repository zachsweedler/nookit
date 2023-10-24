"use client";
import Modal from "react-modal";
import Image from "next/image";
import { Para } from "@/styles/Typography";
import supabaseLoader from "@/supabase-image-loader";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { styled } from "styled-components";
import "./Styles.css";
import "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { ImageSliderCardButtons } from "../image-slider/card/ImageSliderCardButtons";

export default function ImageCarousel({
   locationImages,
   nookImages,
   isOpen,
   onRequestClose,
}) {
   const images =
      locationImages && nookImages ? [...locationImages, ...nookImages] : [];
 
   const customModalStyles = {
      overlay: {
         backgroundColor: "#ffffff",
         zIndex: 100000,
         display: "flex",
         alignItems: "start",
         justifyContent: "center",
      },
      content: {
         border: "none",
         backgroundColor: "#ffffff",
         padding: "0px",
         width: "100vw",
         height: "100dvh",
         position: "relative",
         margin: "0",
         inset: "0px",
         overflowY: "scroll",
         padding: "0px",
      },
   };

   return (
      <Modal
         isOpen={isOpen}
         style={customModalStyles}
         onRequestClose={onRequestClose}
      >
         <Nav onClick={onRequestClose}>
            <Image
               src="/back-icon-black.svg"
               alt="back-icon"
               width={12}
               height={12}
            />
            <Para size="textmd" $weight="medium" style={{ cursor: "pointer" }}>
               Back
            </Para>
         </Nav>
         <Wrapper>
            <Swiper
               modules={[FreeMode, Navigation]}
               spaceBetween={0}
               slidesPerView={1}
               watchSlidesProgress
               loop={true}
               style={{
                  height: 'calc(100dvh - 60px)',
                  width: "100%",
               }}
            >
               {images?.map((image) => (
                  <SwiperSlide
                     key={image}
                     style={{ width: "100%", position: "relative" }}
                  >
                     <Image
                        loader={supabaseLoader}
                        alt="nook-images"
                        src={`user-images/${image}`}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                     />
                  </SwiperSlide>
               ))}
               <ImageSliderCardButtons />
            </Swiper>
         </Wrapper>
      </Modal>
   );
}

const Nav = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 3px;
   align-items: center;
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   z-index: 99999;
   height: 60px;
   background-color: white;
   padding: 0px 20px;
   &:hover {
      cursor: pointer;
   }
`;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   width: 100%;
   height: auto;
   overflow: hidden;
   z-index: 1000;
   padding: 0px;
   width: 100vw;
   padding: 60px 0px 0px 0px;
   margin: auto;
`;
