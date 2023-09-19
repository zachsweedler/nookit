'use client'
import styled from 'styled-components';

const getColorFromTheme = (theme, colorKey) => {
    if (!colorKey) return undefined;
  
    const keys = colorKey.split('.');
    let current = theme.color;
  
    for (let key of keys) {
      current = current[key];
      if (!current) return undefined;
    }
  
    return current;
  };
  
  // Define the base styles for a header
  const BaseHeader = styled.h1`
    font-size: ${({ theme, size }) => theme.fontSize[size]};
    letter-spacing: ${({ theme, size }) => theme.letterSpacing[size]};
    line-height: ${({ theme, size }) => theme.lineHeight[size]};
    font-weight: ${({ theme, size, $weight }) => theme.fontWeight[size][$weight]};
    color: ${({ theme, color }) => getColorFromTheme(theme, color) || theme.color.black};
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
      font-size: ${({ theme, size }) => theme.fontSize.tablet[size]};
    }
    // Default to primary.brand.b500 if no color is specified.
  `;
  
  // Define the base styles for a paragraph
  const BasePara = styled.p`
    font-size: ${({ theme, size }) => theme.fontSize[size]};
    letter-spacing: ${({ theme, size }) => theme.letterSpacing[size]};
    line-height: ${({ theme, size }) => theme.lineHeight[size]};
    font-weight: ${({ theme, size, $weight }) => theme.fontWeight[size][$weight]};
    color: ${({ theme, color }) => getColorFromTheme(theme, color) || theme.color.black};
    &:hover {
      text-decoration:  ${({ $isLink }) => $isLink ? "underline" : "none"};
      cursor: ${({ $isLink }) => $isLink ? "pointer" : "default"};
    }
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
      font-size: ${({ theme, size }) => theme.fontSize.tablet[size]};
    }
    // Default to primary.brand.b500 if no color is specified.
  `;
  
export const H1 = styled(BaseHeader).attrs({ as: 'h1', size: 'display2xl' })``;
export const H2 = styled(BaseHeader).attrs({ as: 'h2', size: 'displayxl' })``;
export const H3 = styled(BaseHeader).attrs({ as: 'h3', size: 'displaylg' })``;
export const H4 = styled(BaseHeader).attrs({ as: 'h4', size: 'displaymd' })``;
export const H5 = styled(BaseHeader).attrs({ as: 'h5', size: 'displaysm' })``;
export const H6 = styled(BaseHeader).attrs({ as: 'h6', size: 'displayxs' })``;
export const Para = styled(BasePara)``;
