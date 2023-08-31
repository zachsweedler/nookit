'use client'
import { styled } from 'styled-components'

export const StepSection = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  width: 100%;
`;

export const InputErrorWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`

export const AmenitiesWrapper = styled.div`
  display: flex;
  padding: 0px;
  background-color: ${({theme})=>theme.color.primary.brand.b25};
  height: 350px;
  overflow: scroll;
  border-radius: 5px;
  padding-top: 30px;
`

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 12px;
  align-items: center;
`

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  padding: 0px 30px 40px 30px;
`