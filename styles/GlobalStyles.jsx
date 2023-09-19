"use client";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

    * {
        box-sizing: border-box;
        margin: 0; 
        padding: 0;
    }

    *:focus {
        outline: none;
    }

    html {
        font-size: 62.5% !important;
    }

    body {
        line-height: 1;
        padding: 0;
        margin: 0; 
        background-color: white;
    } 

    h1 {
        
    }

    h2 {
       
    }

    h3 {
        
    }

    h4 {
        
    }

    h5 {
        
    }


    p {
       
    }

    a {
      font-size: ${({theme}) => theme.fontSize.textmd};
      color: inherit;
      text-decoration: none;
      &:hover {
        text-decoration: none;
        color: inherit;
        cursor: pointer !important;
      }
    }

    li {
        font-size: ${({theme}) => theme.fontSize.textmd} !important;
    }

    ul {
        font-size: ${({theme}) => theme.fontSize.textmd} !important;
    }

    button {
        font-size: ${({theme}) => theme.fontSize.textmd} !important;
        outline: none;
        border: none;
    }

    button:disabled {
        
    }

    label {
        font-size: ${({theme}) => theme.fontSize.textmd} !important;
        color: ${({theme}) => theme.color.primary.grey.g700};
    }

    input {
       border: none;
       outline: none;
       font-size: ${({theme}) => theme.fontSize.textmd} !important;
       height: 50px;
       background-color: #F8F6F5;
       width: 100%;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active{
        -webkit-box-shadow: rgba(255, 255, 255, 0.4) inset !important;
    }

    input::placeholder {
        
    }

    input:focus {
        
    }

    input:hover {
        cursor: pointer;
    }

    select {
        // Below is CSS for the down arrow:
        background: url("/down-arrow-black.svg") no-repeat right center;
        background-size: 12px 12px;
        background-position: calc(100% - 12px) center;
        appearance: none;
        border: none;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        font-size: ${({theme}) => theme.fontSize.textmd};
    }

    select:focus {
    }

    select:hover {
        cursor: pointer;
    }

    textarea {
       font-family: inherit;
       border: none;
       outline: none;
       font-size: ${({theme}) => theme.fontSize.textmd} !important;
       min-height: 150px;
       background-color: #F8F6F5;
       width: 100%;
       resize: vertical;
       padding: 0px;
    }

    textarea:hover {
        cursor: pointer;
    }

    form {
        height: auto;
        width: 100%;
    }

`;
