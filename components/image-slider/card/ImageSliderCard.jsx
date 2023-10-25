"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { ImageSliderCardButtons } from "./ImageSliderCardButtons";
import { styled } from "styled-components";
import supabaseLoader from "@/supabase-image-loader";
import './Styles.css'
import 'swiper/react';
import 'swiper/css';

function ImageSliderCard({ images, onClick }) {
    
  const defaultImage =
    "/assets/images/default-nook-image/default-nook-image.svg";

  const [showButtons, setShowButtons] = useState(false);

  return (
    <Wrapper
      onClick={onClick}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        watchSlidesProgress
      >
        {images?.length > 0 ? (
          images?.map((image) => (
            <SwiperSlide
              key={image}
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
          ))
        ) : (
          <SwiperSlide>
            <Image
              loader={supabaseLoader}
              alt="nook-images"
              src={defaultImage}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </SwiperSlide>
        )}
        {showButtons && (
          <>
            <ImageSliderCardButtons/>
          </>
        )}
      </Swiper>
    </Wrapper>
  );
}

export default ImageSliderCard;


const Wrapper = styled.div`
    width: 100%;
    height: 250px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
`

