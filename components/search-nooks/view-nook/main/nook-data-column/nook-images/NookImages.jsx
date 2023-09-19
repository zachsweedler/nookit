"use client";
import { Para } from "@/styles/Typography";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

export default function NookImages() {
   const nook = useSelector((state) => state.viewNook.nook);

   return (
      
      <Nook>
          <Para size="textlg" $weight="medium">The Nook</Para>
         <NookGrid>
            <NookGridTop>
               <Image
                  loader={supabaseLoader}
                  alt="nook-image"
                  src={`/user-images/${nook?.images?.[0]}`}
                  fill={true}
                  style={{ objectFit: "cover" }}
               />
            </NookGridTop>
            <NookGridBottomLeft>
               <Image
                  loader={supabaseLoader}
                  alt="nook-image"
                  src={`/user-images/${nook?.images?.[1]}`}
                  fill={true}
                  style={{ objectFit: "cover" }}
               />
            </NookGridBottomLeft>
            <NookGridBottomRight>
               <Image
                  loader={supabaseLoader}
                  alt="nook-image"
                  src={`/user-images/${nook?.images?.[2]}`}
                  fill={true}
                  style={{ objectFit: "cover" }}
               />
            </NookGridBottomRight>
         </NookGrid>
      </Nook>
   );
}


const Nook = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   height: 400px;
`;


const NookGrid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-template-rows: 1fr 1fr;
   grid-gap: 12px;
   height: 100%;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
`;

const NookGridTop = styled.div`
   grid-column: 1;
   grid-row: span 2;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
`;

const NookGridBottomLeft = styled.div`
   grid-column: 2;
   grid-row: 1;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
`;

const NookGridBottomRight = styled.div`
   grid-column: 2;
   grid-row: 2;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
`;
