"use client";
import { Para } from "@/styles/Typography";
import React, { useEffect } from "react";
import { spaceAmenities } from "@/utils/space_amenities";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/styles/Checkboxes";
import { styled } from "styled-components";
import { useDispatch } from "react-redux";
import { setFormValues } from "@/slices/nookFormSlice";

export default function LocationAmenities({id}) {
   const {
      register,
      watch,
      formState: { errors },
   } = useFormContext();

   const dispatch = useDispatch();
   const amenities = watch('location_amenities')

   useEffect(()=>{
      dispatch(setFormValues({ location_amenities: amenities }))
   },[amenities, dispatch])

   return (
      <Wrapper id={id}>
         <TitleWrapper>
            <Para size="textmd" $weight="medium">Amenities</Para>
            <Para size="textsm" $weight="regular">These are things you can offer companies that book your nook.</Para>
         </TitleWrapper>
         <Grid>
            {Object.entries(spaceAmenities).map(([category, amenities]) => (
               <CategoryWrapper key={category}>
                  <Para $weight="medium" size="textsm" color="black">
                     {category}
                  </Para>
                  {amenities.map((amenity) => (
                     <CheckboxWrapper key={amenity}>
                        <Checkbox
                           id="filled-basic"
                           variant="filled"
                           name="location_amenities"
                           value={amenity}
                           {...register("location_amenities")}
                        />
                        <Para $weight="regular" size="textsm" color="black">
                           {amenity}
                        </Para>
                     </CheckboxWrapper>
                  ))}
               </CategoryWrapper>
            ))}
            {errors.location_amenities && (
               <Para size="textxs" $weight="regular" color="error">
                  {errors.location_amenities.message}
               </Para>
            )}
         </Grid>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 50px;
   scroll-margin-top: 120px;
`
const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-gap: 60px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
   }
`;

const CheckboxWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   align-items: center;
`;

const CategoryWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 5px;
`