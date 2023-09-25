"use client";
import Modal from "react-modal";
import Image from "next/image";
import { H6, Para } from "@/styles/Typography";
import styled from "styled-components";
import supabaseLoader from "@/supabase-image-loader";
import { Divider } from "@/styles/mui/Divider";
import ImageCarousel from "../image-carousel/ImageCarousel";
import { useState } from "react";

export default function ImageGallery({
   locationImages,
   nookImages,
   isOpen,
   onRequestClose,
}) {
   const [openCarousel, setOpenCarousel] = useState(false);

   const customModalStyles = {
      overlay: {
         backgroundColor: "#ffffff",
         zIndex: 9999,
         display: "flex",
         alignItems: "start",
         justifyContent: "center",
         overflow: 'hidden'
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

   const handleImageClick = () => {
      setOpenCarousel(true);
   };
   function close() {
      setOpenCarousel(false);
   }

   return (
      <>
         <Modal
            isOpen={isOpen}
            style={customModalStyles}
            onRequestClose={onRequestClose}
         >
            <Main>
               <Nav onClick={onRequestClose}>
                  <Image
                     src="/back-icon-black.svg"
                     alt="back-icon"
                     width={12}
                     height={12}
                  />
                  <Para
                     size="textmd"
                     $weight="medium"
                     style={{ cursor: "pointer" }}
                  >
                     Close
                  </Para>
               </Nav>
               <Section>
                  <div>
                     <H6 $weight="semibold">The Store</H6>
                     <Para size="textmd">
                        Photos of the overall store location
                     </Para>
                  </div>
                  <ImageGrid>
                     {locationImages.map((image, index) => (
                        <ImageWrapper key={image} spanTwoRows={index === 1}                            onClick={handleImageClick}>
                           <Image
                              loader={supabaseLoader}
                              alt="nookit-image"
                              src={`user-images/${image}`}
                              fill={true}
                              style={{ objectFit: "cover" }}
                           />
                        </ImageWrapper>
                     ))}
                  </ImageGrid>
               </Section>
               <Divider />
               <Section>
                  <div>
                     <H6 $weight="semibold">The Nook</H6>
                     <Para size="textmd">
                        Photos of the nook within the store location
                     </Para>
                  </div>
                  <ImageGrid>
                     {nookImages.map((image, index) => (
                        <ImageWrapper
                           key={image}
                           spanTwoRows={index % 2 === 1}
                           onClick={handleImageClick}
                        >
                           <Image
                              loader={supabaseLoader}
                              alt="nookit-image"
                              src={`user-images/${image}`}
                              fill={true}
                              style={{ objectFit: "cover" }}
                           />
                        </ImageWrapper>
                     ))}
                  </ImageGrid>
               </Section>
            </Main>
         </Modal>
         <ImageCarousel
            isOpen={openCarousel}
            onRequestClose={close}
            nookImages={nookImages}
            locationImages={locationImages}
         />
      </>
   );
}

const Main = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
   width: 100%;
   max-width: ${({ theme }) => theme.container.md};
   margin: auto;
   padding: 90px 30px 90px 30px;
`;

const Section = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;

const ImageGrid = styled.div`
   display: grid;
   gap: 14px;
   width: 100%;
   overflow: hidden;
   grid-template-rows: auto;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: repeat(auto-fill, minmax(1fr, 1fr));
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.mobile}) {
      grid-template-columns: 1fr;
   }
`;

const ImageWrapper = styled.div`
   position: relative;
   width: 100%;
   height: ${(props) => (props.spanTwoRows ? "auto" : "200px")};
   border-radius: 5px;
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
   grid-row: span ${(props) => (props.spanTwoRows ? "2" : "1")};
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      height: ${(props) => (props.spanTwoRows ? "auto" : "250px")};
   }

   @media screen and (max-width: ${({ theme }) => theme.breakPoint.mobile}) {
      height: ${(props) => (props.spanTwoRows ? "250px" : "250px")};
   }
`;

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
