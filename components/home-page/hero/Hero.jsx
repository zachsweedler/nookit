"use client";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { H2, Para } from "@/styles/Typography";
import { styled } from "styled-components";
import { availableCities } from "@/utils/availableCities";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "./SliderStyle.css";
import { SelectHero } from "@/styles/SelectHero";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function Hero() {
   const stores = [
      {
         name: "Boris & Horton, East Village",
         location: "New York, NY",
         logo: "/borishorton-logo.png",
         image: "/boris-horton-store.png",
      },
   ];

   const router = useRouter()
   const [isDesktop, setIsDesktop] = useState();

   const updateMedia = () => {
      setIsDesktop(window.innerWidth > 1000);
   };

   useEffect(() => {
      window.addEventListener("resize", updateMedia);
      updateMedia();
      return () => window.removeEventListener("resize", updateMedia);
   });

   return (
      <>
         <Wrapper>
            <Container
               size="xl"
               style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "end",
                  height: "100%",
               }}
            >
               {isDesktop ? (
                  <StoreSlider>
                     <BrowseCard>
                        <H2>
                           Book a nook
                           <br />
                           within a store
                        </H2>
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
                           <Button $brandcolor={true} onClick={() => router.push('/s')}>Browse Nooks</Button>
                        </Form>
                     </BrowseCard>
                     <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        watchSlidesProgress
                        loop={true}
                        style={{
                           width: "100%",
                           height: "100%",
                           borderRadius: "20px",
                           overflow: "hidden",
                        }}
                     >
                        {stores?.map((store) => (
                           <SwiperSlide key={store} style={{ width: "100%" }}>
                              <LinearGradient>
                                 <Image
                                    alt="nook-images"
                                    src={store.image}
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: "cover" }}
                                 />
                              </LinearGradient>
                              <StoreInfo>
                                 <Image
                                    alt="host-logo"
                                    src={store.logo}
                                    width={50}
                                    height={50}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{
                                       objectFit: "cover",
                                       borderRadius: "100%",
                                    }}
                                 />
                                 <NameLocation>
                                    <Para
                                       size="textmd"
                                       $weight="medium"
                                       color="white"
                                    >
                                       {store.name}
                                    </Para>
                                    <Para
                                       size="textmd"
                                       $weight="regular"
                                       color="white"
                                    >
                                       {store.location}
                                    </Para>
                                 </NameLocation>
                              </StoreInfo>
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </StoreSlider>
               ) : (
                  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                     <BrowseCard>
                        <H2>
                           Book a nook
                           <br />
                           within a store
                        </H2>
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
                           <Button $brandcolor={true}>Browse Nooks</Button>
                        </Form>
                     </BrowseCard>
                     <StoreSlider>
                        <Swiper
                           spaceBetween={0}
                           slidesPerView={1}
                           watchSlidesProgress
                           loop={true}
                           style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "20px",
                              overflow: "hidden",
                           }}
                        >
                           {stores?.map((store) => (
                              <SwiperSlide
                                 key={store}
                                 style={{ width: "100%" }}
                              >
                                 <LinearGradient>
                                    <Image
                                       alt="nook-images"
                                       src={store.image}
                                       fill={true}
                                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                       style={{ objectFit: "cover" }}
                                    />
                                 </LinearGradient>
                                 <StoreInfo>
                                    <Image
                                       alt="host-logo"
                                       src={store.logo}
                                       width={50}
                                       height={50}
                                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                       style={{
                                          objectFit: "cover",
                                          borderRadius: "100%",
                                       }}
                                    />
                                    <NameLocation>
                                       <Para
                                          size="textmd"
                                          $weight="medium"
                                          color="white"
                                       >
                                          {store.name}
                                       </Para>
                                       <Para
                                          size="textmd"
                                          $weight="regular"
                                          color="white"
                                       >
                                          {store.location}
                                       </Para>
                                    </NameLocation>
                                 </StoreInfo>
                              </SwiperSlide>
                           ))}
                        </Swiper>
                     </StoreSlider>
                  </div>
               )}
            </Container>
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   height: 100dvh;
   width: 100vw;
   align-items: start;
   justify-content: end;
   padding: 90px 0px;
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 120px 0px 100px 0px;
      height: auto;
   }
`;

const BrowseCard = styled.div`
   display: flex;
   padding: 70px;
   row-gap: 50px;
   flex-direction: column;
   position: absolute;
   width: fit-content;
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   left: 0;
   top: 50%;
   transform: translateY(-50%);
   z-index: 100;
   border-radius: 20px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      position: relative;
      transform: translateY(0px);
      padding: 0px;
      width: 100%;
      row-gap: 40px;
      height: auto;
      border-radius: 0px;
   }
`;

const Form = styled.div`
   display: flex;
   row-gap: 20px;
   flex-direction: column;
`;

const StoreSlider = styled.div`
   position: relative;
   height: 100%;
   width: 100%;
   padding-left: 20%;
   border-radius: 20px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding-left: 0px;
      padding-top: 30px;
      height: 500px;
   }
`;

const StoreInfo = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   align-items: center;
   justify-content: start;
   position: absolute;
   bottom: 30px;
   right: 30px;
   z-index: 100;
`;

const NameLocation = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 0px;
   align-items: start;
`;

const LinearGradient = styled.div`
   &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
         180deg,
         rgba(0, 0, 0, 0) 0%,
         rgba(0, 0, 0, 0.5) 100%
      );
      z-index: 1;
   }
`;
