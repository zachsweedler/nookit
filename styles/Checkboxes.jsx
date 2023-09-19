"use client";
import { styled } from "styled-components";

export const Checkbox = styled.input.attrs({
  type: "checkbox",
})`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  outline: none;
  border-radius: 5px;
  flex-shrink: 0;
  border: ${({ theme }) =>
    `1px solid ${theme.color.primary.grey.g50} !important`};
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  appearance: none;
  &:checked {
    background-image: url(/check-icon-brand.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 50%;
    background-color: none;
    border: ${({ theme }) =>
      `1px solid ${theme.color.primary.brand.b600} !important`};
  }
  &:hover {
    cursor: pointer;
  }
`;

////////

export const TextCheckboxWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  height: 50px;
  width: 100%;
  border-radius: 5px;
  user-select: none;
  font-size: ${({ theme }) => theme.fontSize.textmd};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.primary.brand.b600 : theme.color.black};
  border: ${({ theme, $isActive }) =>
    $isActive
      ? `1px solid ${theme.color.primary.brand.b600}`
      : `1px solid ${theme.color.primary.grey.g50}`};
  &:hover {
    cursor: pointer;
  }
`;
