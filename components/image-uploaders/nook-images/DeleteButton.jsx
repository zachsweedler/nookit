/* eslint-disable @next/next/no-img-element */
'use client'
import React from "react";
import styled from "styled-components";

function DeleteButton({ onClick, disabled }) {
  return (
    <Delete onClick={onClick} disabled={disabled}>
      <img
        alt=""
        width="12"
        height="12"
        src={"/trash-icon-white.svg"}
      />
    </Delete>
  );
}

export default DeleteButton;

const Delete = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7.6px;
  margin: 6px;
  border-radius: 100%;
  width: auto;
  height: auto;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({disabled}) => disabled ? "50%" : "100%"};
`;
