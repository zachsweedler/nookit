"use client";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";
import styled, { useTheme } from "styled-components";
import { Para } from "../Typography";

function MuiTooltip({ title, text, placement }) {
  const theme = useTheme();
  return (
    <Wrapper>
      <Para size="textsm" $weight="regular">{title}</Para>
      <Tooltip
        placement={placement}
        title={text}
        arrow
        slotProps={{ 
          tooltip: { 
            sx: { 
              backgroundColor: '#000000', 
              fontSize: theme.fontSize.textmd,
              lineHeight: theme.lineHeight.textxl,
              padding: '12px',
            },
          },
          arrow: {
            sx: {
              opacity: '100% !important'
            }
          }
        }}
      >
        <Image
          alt="tool-tip"
          src="/tooltip.svg"
          width={12}
          height={12}
          style={{cursor: 'pointer'}}
        />
      </Tooltip>
    </Wrapper>
  );
}

export default MuiTooltip;


const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`