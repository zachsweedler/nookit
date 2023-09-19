"use client";
import React from "react";
import NookImageUploader from "@/components/image-uploaders/nook-images/NookImageUploader";
import { Section } from "./Styles";

export default function LocationImages({ id }) {
   return (
      <Section id={id}>
         <NookImageUploader
            isNookPhotos={false}
            fieldName="location_images"
            title="Location Images"
            id={id}
         />
      </Section>
   );
}
