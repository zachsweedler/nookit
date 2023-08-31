"use client";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import { styled } from "styled-components";

export default function ImageCard({ src }) {
   return (
      <Card>
         <Image
            loader={supabaseLoader}
            alt="nook image"
            src={src}
            fill={true}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
         />
      </Card>
   );
}

const Card = styled.div`
   display: flex;
   position: relative;
   height: 400px;
   width: 600px;
   border-radius: 5px;
   overflow: hidden;
   margin-left: 30px;
`;
