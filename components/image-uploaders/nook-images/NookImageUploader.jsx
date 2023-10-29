import React, { useState, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import Image from "next/image";
import { ImageDropZone, ImageGrid, ImageWrapper } from "./Styles";
import DeleteButton from "./DeleteButton";
import { Para } from "@/styles/Typography";
import { useFormContext } from "react-hook-form";
import { useNookUUID } from "@/hooks/client-side/useNookId";
import { useUserId } from "@/hooks/client-side/useUserId";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { styled } from "styled-components";
import supabaseLoader from "@/supabase-image-loader";
import { useLocationUUID } from "@/hooks/client-side/useLocationId";

function NookImageUploader({ fieldName, isNookPhotos, title }) {
   const maxNumber = 15;
   const acceptedTypes = ["jpg", "jpeg", "png", "tif", "gif", "bmp", "webp"];
   const nookId = useNookUUID();
   const locationId = useLocationUUID();
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const [imagesArray, setImagesArray] = useState([]);

   const {
      formState: { errors },
      setValue,
      getValues,
   } = useFormContext();

   useEffect(() => {
      const getImagesFromStorage = async () => {
         const { data: images, error: imagesError } = await supabase.storage
            .from("user-images")
            .list(
               isNookPhotos
                  ? `${userId}/locations/${locationId}/nooks/${nookId}`
                  : `${userId}/locations/${locationId}/location_images`,
               {
                  sortBy: { column: "created_at", order: "asc" },
               }
            );
         if (imagesError) {
            console.log("error listing images", imagesError);
         } else {
            const loadedImages = images.map((image) => image.name);
            const paths = loadedImages.map((image) =>
               isNookPhotos
                  ? `${userId}/locations/${locationId}/nooks/${nookId}/${image}`
                  : `${userId}/locations/${locationId}/location_images/${image}`
            );
            // Use the functional form of setImagesArray to ensure the correct state update
            setImagesArray((prevImagesArray) => [...prevImagesArray, ...paths]);
            setValue(fieldName, paths);
         }
      };
      getImagesFromStorage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isNookPhotos, getValues, setValue, fieldName, nookId, userId]);

   const handleImageUpload = async (file) => {
      const { data, error } = await supabase.storage
         .from("user-images")
         .upload(
            isNookPhotos
               ? `${userId}/locations/${locationId}/nooks/${nookId}/${file.name}`
               : `${userId}/locations/${locationId}/location_images/${file.name}`,
            file,
            { upsert: true }
         );
      if (error) {
         console.log(error);
      } else {
         return isNookPhotos
            ? `${userId}/locations/${locationId}/nooks/${nookId}/${file.name}`
            : `${userId}/locations/${locationId}/location_images/${file.name}`;
      }
   };

   const handleImageChange = async (imageList) => {
      const imageFiles = imageList.map((image) => image.file);
      const uploadedImagePaths = await Promise.all(
         imageFiles.map((file) => handleImageUpload(file))
      );
      const updatedImages = [...imagesArray, ...uploadedImagePaths];
      setImagesArray(updatedImages);
      setValue(fieldName, updatedImages);
   };

   const handleImageDelete = async (imagePath) => {
      const { error } = await supabase.storage
         .from("user-images")
         .remove([imagePath]);
      if (error) {
         console.log("Error deleting image:", error);
         return;
      }
      const filteredImages = imagesArray.filter((image) => image !== imagePath);
      setImagesArray(filteredImages);
      setValue(fieldName, filteredImages);
   };

   return (
      <Wrapper>
         <Para size="textmd" $weight="medium">
            {title}
         </Para>
         <ImageUploading
            onChange={handleImageChange}
            maxNumber={maxNumber}
            acceptType={acceptedTypes}
            maxFileSize={30000000}
            multiple
         >
            {({
               onImageUpload,
               isDragging,
               dragProps,
               errors: uploaderErrors,
            }) => (
               <Wrapper>
                  {imagesArray?.length === 0 ? (
                     <ImageDropZone onClick={onImageUpload} {...dragProps}>
                        {isDragging ? (
                           <Para
                              $weight="regular"
                              size="textsm"
                              color="primary.brand.b950"
                           >
                              Now Drop!
                           </Para>
                        ) : (
                           <div style={{ display: "inline-flex", gap: "3px" }}>
                              <Para
                                 $weight="regular"
                                 size="textsm"
                                 color="primary.brand.b950"
                              >
                                 Choose a file
                              </Para>
                              <Para
                                 $weight="regular"
                                 size="textsm"
                                 color="primary.brand.b950"
                              >
                                 or drag it here
                              </Para>
                           </div>
                        )}
                     </ImageDropZone>
                  ) : (
                     <ImageGrid>
                        {imagesArray?.map((image, index) => {
                           return (
                              <ImageWrapper key={index}>
                                 <Image
                                    loader={supabaseLoader}
                                    alt="nook_image"
                                    src={`user-images/${image}`}
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: "cover" }}
                                 />
                                 <DeleteButton
                                    onClick={() => handleImageDelete(image)}
                                 />
                              </ImageWrapper>
                           );
                        })}
                        {imagesArray.length > 0 && (
                           <ImageDropZone
                              onClick={onImageUpload}
                              {...dragProps}
                           >
                              {isDragging ? (
                                 <Para
                                    $weight="regular"
                                    size="textsm"
                                    color="primary.brand.b950"
                                 >
                                    Now Drop!
                                 </Para>
                              ) : (
                                 <Para
                                    $weight="regular"
                                    size="textsm"
                                    color="primary.brand.b950"
                                 >
                                    Add +
                                 </Para>
                              )}
                           </ImageDropZone>
                        )}
                     </ImageGrid>
                  )}
                  {errors[fieldName] && (
                     <Para size="textxs" $weight="regular" color="error">
                        {errors[fieldName].message}
                     </Para>
                  )}
                  <ErrorListUploader uploaderErrors={uploaderErrors} />
               </Wrapper>
            )}
         </ImageUploading>
      </Wrapper>
   );
}

const ErrorListUploader = ({ uploaderErrors }) => (
   <div>
      {uploaderErrors?.maxFileSize && (
         <Para $weight="regular" size="textsm" color="error">
            The file size exceeds the maximum limit.
         </Para>
      )}
      {uploaderErrors?.acceptType && (
         <Para $weight="regular" size="textsm" color="error">
            Your selected file type is not allowed.
         </Para>
      )}
      {uploaderErrors?.maxNumber && (
         <Para $weight="regular" size="textsm" color="error">
            Number of selected images exceed maxNumber.
         </Para>
      )}
   </div>
);

export default NookImageUploader;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
`;
