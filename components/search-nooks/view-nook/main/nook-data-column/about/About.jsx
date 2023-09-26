'use client'

import { Para } from "@/styles/Typography";
import { useSelector } from "react-redux";
import { styled } from "styled-components"

export default function About () {

    const nook = useSelector((state) => state.viewNook.nook);

    return (
        
        <Wrapper>
            <Para size="textlg" $weight="medium">About</Para>
            <Para size="textmd" $weight="regular">{nook?.about}</Para>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 9px;
    width: 100%;
`