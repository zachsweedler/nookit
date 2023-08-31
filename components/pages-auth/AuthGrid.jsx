'use client'
import { styled } from "styled-components"

export const AuthGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    width: 100vw;
    height: 100vh;
    position: relative;
    @media screen and (max-width: ${({theme}) => theme.breakPoint.tablet})  {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }
`