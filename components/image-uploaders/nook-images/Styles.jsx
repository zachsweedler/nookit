'use client'
import { styled } from 'styled-components'

export const ImageDropZone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  width: 100%;
  height: 120px;
  cursor: pointer;
  border: 1.5px solid ${({theme})=> theme.color.primary.grey.g100};
  border-style: dashed;
  &:hover {
    background-color: ${({theme})=> theme.color.primary.brand.b925};
  }
`

export const ImageWrapper = styled.div`
  display: flex;
  height: auto;
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 5px;
`

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  height: fit-content;
  grid-gap: 12px;
  @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
   }
`