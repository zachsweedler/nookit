'use client'
import styled from "styled-components";

export const MethodsWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 18px;
`;

export const Card = styled.div`
   padding: 15px 18px;
   display: flex;
   flex-direction: row;
   align-items: center;
   border-radius: 5px;
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
   justify-content: space-between;
`;

export const CardInfo = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: center;
   column-gap: 15px;
`;
