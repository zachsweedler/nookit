"use client";
import React from "react";
import styled from "styled-components";
import { Para } from "./Typography";

export const SelectHero = ({
   options,
   fieldName,
   register = null,
   errors,
   label,
   onChange,
   adornment,
}) => {
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
      </Wrap>
   );
};

export default SelectHero;

const SelectWrapper = styled.div`
   position: relative;
   width: 100%;
`;

const Label = styled.label`
   font-weight: 500;
   font-size: 1.4rem !important;
   color: ${({ theme }) => theme.color.black};
`;

const StyledSelect = styled.select`
   align-items: center;
   height: 50px;
   border-radius: 5px;
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g100};
   overflow: hidden;
   position: relative;
   border-radius: 5px;
   padding: 0px 35px;
   width: 100%;
   &::placeholder {
      color: ${({ theme }) => theme.color.primary.brand.b950};
   }
`;

const Adornment = styled.div`
   position: absolute;
   top: 50%;
   left: 15px;
   transform: translateY(-50%);
`;

const Wrap = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   width: 100%;
   align-items: start;
`;
