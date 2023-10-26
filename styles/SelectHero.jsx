"use client";
import React from "react";
import styled from "styled-components";
import { Para } from "./Typography";
import { useRouter } from "next/navigation";
import { Button } from "./Buttons";

export const SelectHero = ({
   options,
   fieldName,
   register = null,
   errors,
   label,
   onChange,
   adornment,
}) => {
   const router = useRouter();

   const handleSearch = (e) => {
      e.preventDefault();
      router.push("/s");
      console.log("clicked");
   };

   return (
      <Wrap>
         <SelectWrapper>
            {adornment && <Adornment>{adornment}</Adornment>}
            <StyledSelect
               {...register?.(fieldName, {
                  onChange: onChange,
               })}
            >
               <option value="" hidden>
                  {label}
               </option>
               {options?.map((item) => (
                  <option key={item.value} value={item.value}>
                     {item}
                  </option>
               ))}
            </StyledSelect>
         </SelectWrapper>
         {errors?.[fieldName] && (
            <Para size="textxs" $weight="regular" color="error">
               {errors?.[fieldName].message}
            </Para>
         )}
         <Button $brandcolor={true} onClick={handleSearch} style={{width: 'auto', borderRadius: '0px'}}>
            Browse
         </Button>
      </Wrap>
   );
};

export default SelectHero;

const SelectWrapper = styled.div`
   position: relative;
   width: 100%;
`;

const StyledSelect = styled.select`
   align-items: center;
   height: 50px;
   border-radius: 0px !important;
   overflow: hidden;
   position: relative;
   border-radius: 5px;
   padding: 0px 35px;
   width: 100%;
   background-color:  ${({ theme }) => theme.color.primary.brand.b925};
   &::placeholder {
      color: ${({ theme }) => theme.color.primary.brand.b950};
   }
`;

const Adornment = styled.div`
   position: absolute;
   top: 50%;
   left: 15px;
   transform: translateY(-50%);
   z-index: 100;
`;

const Wrap = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 0px;
   width: 100%;
   align-items: start;
   border-radius: 100px;
   overflow: hidden; 
   transition: box-shadow 0.5s cubic-bezier(0.23, 1, 0.320, 1);
   &:hover {
      box-shadow: ${({ theme }) => theme.boxShadow.shadowxl};
   }
`;
