'use client'
import { styled } from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ theme, size }) => theme.container[size]};
  margin-left: auto;
  margin-right: auto;
  padding-left: 30px; 
  padding-right: 30px;
  @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
    padding-left: 25px; 
    padding-right: 25px;
   }
`;

export default Container;
