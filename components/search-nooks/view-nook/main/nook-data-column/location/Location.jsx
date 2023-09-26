"use client";
import { H6, Para } from "@/styles/Typography";
import Image from "next/image";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

export default function Location() {

   const nook = useSelector((state) => state.viewNook.nook);

   return (
      <Wrapper>
         <H6 $weight="semibold">{nook?.location_name}</H6>
         <LocationWrapper>
            <Image
               alt="location-pin"
               src="/location-pin-grey.svg"
               width={15}
               height={15}
            />
            <StyledPara size="textsm" $weight="regular" color="black">
               {nook?.location_full_address}
            </StyledPara>
         </LocationWrapper>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 9px;
   width: 100%;
`;

const LocationWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: center;
   width: 100%;
   overflow: hidden;
`;

const StyledPara = styled(Para)`
   display: -webkit-box;
   -webkit-line-clamp: 1; 
   -webkit-box-orient: vertical;
   overflow: hidden;
`;