"use client";
import { styled } from "styled-components";
import { Para } from "./Typography";

export default function Textarea({
   fieldName,
   placeholder,
   register,
   errors,
   label,
   ref,
   onChange,
}) {
   return (
      <Wrap>
         <Label htmlFor={fieldName}>{label}</Label>
         <StyledTextarea
            ref={ref}
            name={fieldName}
            placeholder={placeholder}
            {...register(fieldName, {
               onChange: onChange,
            })}
         />
         {errors[fieldName] && (
            <Para size="textxs" $weight="regular" color="error">
               {errors[fieldName].message}
            </Para>
         )}
      </Wrap>
   );
}

const Label = styled.label`
   font-weight: 500;
   font-size: 1.4rem !important;
   color: black;
`;

const StyledTextarea = styled.textarea`
   border-radius: 5px;
   padding: 15px;
   &::placeholder {
      color: #a09996;
   }
`;

const Wrap = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   width: 100%;
   align-items: start;
`;
