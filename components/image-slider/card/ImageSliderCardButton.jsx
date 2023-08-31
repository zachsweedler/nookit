/* eslint-disable @next/next/no-img-element */
'use client'
import { useSwiper } from "swiper/react";
import styled from "styled-components";


export function ImageSliderButton({ direction }) {
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
    <ButtonWrapper onClick={handleClick} $direction={direction} className={direction === "next" ? ".swiper-button-next" : ".swiper-button-prev"}>
      <img src={buttonImage} alt={direction === "next" ? "Next" : "Previous"} style={{width: "100%", height: "100%", position: "absolute"}}/>
      <img src={buttonImage} alt={direction === "next" ? "Next" : "Previous"} style={{width: "100%", height: "100%", position: "absolute"}}/>
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
    right: ${({$direction})=> $direction === "next" ? '5px' : null};
    left: ${({$direction})=> $direction === "prev" ? '5px' : null};
`;