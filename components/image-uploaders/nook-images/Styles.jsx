'use client'
import { styled } from 'styled-components'

export const ImageDropZone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 50px;
  border-radius: 5px;
  width: 100%;
  height: auto;
  cursor: pointer;
  background-color: ${({theme})=> theme.color.primary.brand.b25};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='lightgrey' stroke-width='1.5' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  &:hover {
    background-color: #efebea;
  }
`

export const ImageWrapper = styled.div`
  display: flex;
  height: auto;
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
  border-radius: 5px;
`

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  height: fit-content;
  grid-gap: 12px;
`