"use client";

import { Para } from "@/styles/Typography";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

export default function Amenities() {
   const nook = useSelector((state) => state.viewNook.nook);

   return (
      <Wrapper>
         <Para size="textlg" $weight="medium">
            Amenities
         </Para>
         <Grid>
         {nook?.locations?.amenities?.map((amenity, index) => (
            <Amenity key={index}>
               <Para size="textmd" $weight="regular">
                  {amenity}
               </Para>
            </Amenity>
         ))}
         </Grid>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   width: 100%;
`;

const Amenity = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 0px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 9px;
`