"use client";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import styled from "styled-components";

export default function Back({ text }) {
   return (
      <a href="javascript:history.back()">
         <Wrapper>
            <Image
               alt="back-button"
               src="/back-icon-black.svg"
               width={12}
               height={12}
            />

            <Para $isLink={true} size="textmd" $weight="regular">
               {text}
            </Para>
         </Wrapper>
      </a>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: center;
`;
