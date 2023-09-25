'use client'
import { useSwiper } from "swiper/react";
import styled from "styled-components";
import Image from "next/image";

export function ImageCarouselButton({ direction }) {
  const swiper = useSwiper();

  const handleClick = (e) => {
    if (direction === "next") {
      swiper?.slideNext();
    } else {
      swiper?.slidePrev();
    }
    e.stopPropagation();
  };

  // Replace the below with the actual image path or visual representation
  const buttonImage = direction === "next" ? "/swiper-left-icon.svg" : "/swiper-right-icon.svg";

  return (
    <ButtonWrapper onClick={handleClick} direction={direction} className={direction === "next" ? ".swiper-button-next" : ".swiper-button-prev"}>
      <Image src={buttonImage} alt={direction === "next" ? "Next" : "Previous"} fill={true} style={{objectFit: "contain"}} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 30px;
  height: 30px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 600;
  top: 50%;
  transform: translateY(-50%); 
  cursor: pointer;
  right: ${({direction})=> direction === "next" ? '5px' : null};
  left: ${({direction})=> direction === "prev" ? '5px' : null};
`;