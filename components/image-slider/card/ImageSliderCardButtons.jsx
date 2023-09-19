/* eslint-disable @next/next/no-img-element */
'use client'
import { useSwiper } from "swiper/react";
import styled from "styled-components";


export function ImageSliderCardButtons() {
  const swiper = useSwiper();

  const handleButtonClick = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    if (direction === "next") {
      swiper?.slideNext();
    } else {
      swiper?.slidePrev();
    }
  };

  const buttonImageNext = "/swiper-left-icon.svg";
  const buttonImagePrev = "/swiper-right-icon.svg";

  return (
    <>
    <ButtonWrapper onClick={(e) => handleButtonClick(e, 'next')} $direction="next" className="swiper-button-next">
        <img src={buttonImageNext} alt="next" style={{width: "100%", height: "100%"}}/>
    </ButtonWrapper>
    <ButtonWrapper onClick={(e) => handleButtonClick(e, 'prev')} $direction="prev" className="swiper-button-prev">
      <img src={buttonImagePrev} alt="prev" style={{width: "100%", height: "100%"}}/>
    </ButtonWrapper>
    </>
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
    right: ${({$direction}) => $direction === "next" ? '5px' : 'auto'};
    left: ${({$direction}) => $direction === "prev" ? '5px' : 'auto'};
`;