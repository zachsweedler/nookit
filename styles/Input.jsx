'use client'
import { styled } from "styled-components";
import { Para } from "./Typography";

export default function Input({
   fieldName,
   placeholder,
   register,
   errors,
   label,
   ref,
   onChange,
   disabled,
   hidden,
   adornmentRight,
   adornmentLeft
}) {
   return (
      <Wrap>
         <Label htmlFor={fieldName}>{label}</Label>
         <StyledInputWrapper>
            <StyledInput
               adornmentLeft={adornmentLeft}
               hidden={hidden}
               disabled={disabled}
               ref={ref}
               name={fieldName}
               placeholder={placeholder}
               {...register(fieldName, {
                  onChange: onChange,
               })}
            />
            {adornmentRight && <AdornmentRight>{adornmentRight}</AdornmentRight>}
            {adornmentLeft && <AdornmentLeft>{adornmentLeft}</AdornmentLeft>}
         </StyledInputWrapper>
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
   color: ${({theme}) => theme.color.black};
`;

const StyledInputWrapper = styled.div`
   position: relative;
   width: 100%;
`;

const StyledInput = styled.input`
   border-radius: 5px;
   padding:  ${({adornmentLeft}) => adornmentLeft ? "0px 30px" : "0px 15px"};
   &::placeholder {
      color: ${({theme}) => theme.color.primary.brand.b950};
   }
   &:hover {
      cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
   }
`;

const AdornmentRight = styled.div`
   position: absolute;
   top: 50%;
   right: 15px;
   transform: translateY(-50%);
`;

const AdornmentLeft = styled.div`
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