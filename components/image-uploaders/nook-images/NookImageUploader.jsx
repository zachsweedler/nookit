import React, { useState, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import Image from "next/image";
import { ImageDropZone, ImageGrid, ImageWrapper } from "./Styles";
import DeleteButton from "./DeleteButton";
import { Para } from "@/styles/Typography";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues } from "@/slices/uploadNookSlice";
import { Button } from "@/styles/Buttons";
import { useFormContext } from "react-hook-form";
import { useNookUUID } from "@/hooks/useNookId";
import { useUserId } from "@/hooks/useUserId";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useStorageUpload } from "@/hooks/useStorageUpload";
import { styled } from "styled-components";

function NookImageUploader({ fieldName, isNookPhotos }) {
   const [images, setImages] = useState([]);
   const [uploaderErrors, setUploaderErrors] = useState();
   const [isLoading, setIsLoading] = useState();
   const dispatch = useDispatch();
   const reduxFormState = useSelector((state) => state.uploadNook.formValues);
   const existingImages = useSelector(
      (state) => state.uploadNook.formValues[fieldName]
   );
   const maxNumber = 6;
   const acceptedTypes = ["jpg", "jpeg", "png", "tif", "gif", "bmp", "webp"];
   const userId = useUserId();
   const nookId = useNookUUID();
   const supabase = createClientComponentClient();
   const { handleImageUpload, loading } = useStorageUpload(
      userId,
      nookId,
      isNookPhotos
   );

   const {
      formState: { errors },
      setValue,
   } = useFormContext();

   const handleImageChange = async (imageList) => {
      setIsLoading(true);
      console.log("existing images", existingImages);
      try {
         const removedImages = existingImages.filter((prevImagePath) => {
            const prevImageName = prevImagePath.split("/").pop();
            const isImagePresent = imageList.some(
               (currImage) => currImage.file.name === prevImageName
            );
            // // Debugging logs:
            // console.log("Checking:", prevImageName);
            // console.log("Is present in imageList?", isImagePresent);
            return !isImagePresent;
         });
         console.log("Images to remove:", removedImages);
         for (const imagePath of removedImages) {
            const imageName = imagePath.split("/").pop();
            const { error } = await supabase.storage
               .from("user-images")
               .remove(
                  `${userId}/nooks/${nookId}/${
                     isNookPhotos ? "nook" : "space"
                  }/${imageName}`
               );
            if (error) {
               console.error("Error deleting file:", error);
            }
         }

         setImages(imageList);
         const imageFiles = imageList.map((image) => image.file);
         const paths = await Promise.all(
            imageFiles.map((file) => handleImageUpload(file))
         );
         await dispatch(
            setFormValues({ ...reduxFormState, [fieldName]: paths })
         );
         await setValue(fieldName, paths);
         setIsLoading(false);
      } catch (err) {
         setUploaderErrors([...uploaderErrors, err]);
         setIsLoading(false);
         console.error("Error uploading images:", err);
      }
   };

   return (
      <>
         <ImageUploading
            value={images}
            onChange={handleImageChange}
            maxNumber={maxNumber}
            acceptType={acceptedTypes}
            maxFileSize={30000000}
            multiple
         >
            {({ onImageUpload, onImageRemove, isDragging, dragProps }) => (
               <Wrapper>
                  <ImageDropZone onClick={onImageUpload} {...dragProps}>
                     {isDragging ? (
                        <Para
                           weight="regular"
                           size="textsm"
                           color="primary.brand.b950"
                        >
                           Now Drop!
                        </Para>
                     ) : (
                        <div style={{ display: "inline-flex", gap: "3px" }}>
                           <Para
                              weight="regular"
                              size="textsm"
                              color="primary.brand.b950"
                           >
                              Choose a file
                           </Para>
                           <Para
                              weight="regular"
                              size="textsm"
                              color="primary.brand.b950"
                           >
                              or drag it here
                           </Para>
                        </div>
                     )}
                  </ImageDropZone>
                  {isLoading ? (
                     <Para size="textmd" weight="regular">
                        Uploading...
                     </Para>
                  ) : (
                     <ImageGrid>
                        {existingImages.map((image, index) => {
                           const imageUrl = `user-images/${image}`;
                           return (
                              <ImageItem
                                 key={index}
                                 image={imageUrl}
                                 onRemove={() => onImageRemove(index)}
                                 loading={loading}
                              />
                           );
                        })}
                     </ImageGrid>
                  )}

                  {errors[fieldName] && (
                     <Para size="textxs" weight="regular" color="error">
                        {errors[fieldName].message}
                     </Para>
                  )}
                  <ErrorListUploader uploaderErrors={uploaderErrors} />
               </Wrapper>
            )}
         </ImageUploading>
      </>
   );
}

const ImageItem = ({ image, onRemove, loading }) => {
   return (
      <ImageWrapper>
         <Image
            alt="nook_image"
            src={image}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover", opacity: loading ? "50%" : "100%" }}
         />
         <DeleteButton onClick={onRemove} disabled={loading} />
      </ImageWrapper>
   );
};

const ErrorListUploader = ({ uploaderErrors }) => (
   <div>
      {uploaderErrors?.map((error, index) => (
         <Para key={index} weight="regular" size="textsm" color="error">
            {error.message}
         </Para>
      ))}
   </div>
);

export default NookImageUploader;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
`;
