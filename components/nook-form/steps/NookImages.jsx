"use client";
import React from "react";
import NookImageUploader from "@/components/image-uploaders/nook-images/NookImageUploader";
import { Section } from "./Styles";

export default function NookImages({id}) {

   return (
    <Section id={id}>
         <NookImageUploader
            isNookPhotos={true}
            fieldName="images"
            title='Nook Images'
            id={id}
         />
    </Section>
   );
}

