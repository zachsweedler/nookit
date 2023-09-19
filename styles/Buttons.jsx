'use client'
import styled from "styled-components";

const getBackgroundColor = ({ theme, $brandcolor, $blackcolor, $whitecolor, $googlecolor, $brandoutline }) => {
  if ($brandcolor) return theme.color.primary.brand.b600;
  if ($blackcolor) return theme.color.black;
  if ($whitecolor) return theme.color.white;
  if ($googlecolor) return theme.color.white;
  if ($brandoutline) return "transparent";
  return theme.color.primary.brand.b600;  // Default value
};

const getBackgroundColorHover = ({ theme, $brandcolor, $blackcolor, $whitecolor, $googlecolor, $brandoutline }) => {
  if ($brandcolor) return theme.color.primary.brand.b700;
  if ($blackcolor) return theme.color.primary.grey.g900;
  if ($whitecolor) return theme.color.primary.grey.g25;
  if ($googlecolor) return theme.color.primary.grey.g25;
  if ($brandoutline) return theme.color.primary.brand.b25;
  return theme.color.primary.brand.b600;  // Default value
};

const getTextColor = ({ theme, $brandcolor, $blackcolor, $whitecolor, $googlecolor, $brandoutline }) => {
  if ($brandcolor) return theme.color.white;
  if ($blackcolor) return theme.color.white;
  if ($whitecolor) return theme.color.primary.brand.b600;
  if ($googlecolor) return "#3C4043";
  if ($brandoutline) return theme.color.primary.brand.b600;
  return theme.color.white;  // Default value
};

const getBorderColor = ({ theme, $googlecolor, $brandoutline  }) => {
  if ($googlecolor) return "#DADCE0";
  if ($brandoutline) return theme.color.primary.brand.b600;
  return "transparent";  // Default value
};

export const Button = styled.button`
  width: 100%;
  height: 45px;
  background-color: ${getBackgroundColor};
  border-radius: 5px;
  color: ${getTextColor};
  border: 1px solid ${getBorderColor};
  font-size: ${({ theme }) => theme.fontSize.textmd};
  font-weight: ${({ theme }) => theme.fontWeight.textmd.medium};
  font-family: __Poppins_1562c7;
  padding-left: 15px; 
  padding-right: 15px;
  display: flex;
  align-items: center;
  text-decoration: transparent !important;
  justify-content: center;
  &:hover {
    background-color: ${getBackgroundColorHover};
    cursor: pointer;
  }
`;

/////////////

export const ButtonTab = styled.button`
  width: auto;
  height: 40px;
  color: ${({ theme, $isActive }) => $isActive ? theme.color.primary.brand.b600 : theme.color.primary.grey.g500};
  background-color: ${({ theme, $isActive }) => $isActive ? theme.color.primary.brand.b100 : "transparent"};
  font-size: ${({ theme }) => theme.fontSize.textmd};
  font-weight: ${({ theme }) => theme.fontWeight.textmd.medium};
  padding-left: 12px; 
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  &:hover {
    background-color: ${({ theme, $isActive }) => $isActive ? theme.color.primary.brand.b100 : theme.color.primary.grey.g25};
    cursor: pointer;
  }
`