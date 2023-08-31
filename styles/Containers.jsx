'use client'
import { styled } from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ theme, size }) => theme.container[size]};
  margin-left: auto;
  margin-right: auto;
  padding-left: 30px; 
  padding-right: 30px;
`;

export default Container;

