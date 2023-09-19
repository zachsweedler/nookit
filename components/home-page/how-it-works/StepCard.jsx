'use client'

import { Para } from "@/styles/Typography"
import supabaseLoader from "@/supabase-image-loader"
import Image from "next/image"
import { styled } from "styled-components"

export default function StepCard ({src, title, description}) {
     
    return (
        <Card>
            <ImageWrapper>
                <StyledImage src={src} alt="step-image" fill={true} loader={supabaseLoader}/>
            </ImageWrapper>
            <CardCopy>
                <Para size="displayxs" $weight="medium">{title}</Para>
                <Para size="textmd" $weight="regular">{description}</Para>
            </CardCopy>
        </Card>
    )
}

const Card = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 50px;
    border-radius: 5px;
    overflow: hidden;
`

const ImageWrapper = styled.div`
    background-color: ${({theme})=> theme.color.primary.grey.g25};
    position: relative;
    height: 550px;
    display: flex;
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        height: 280px;
    }
`
const CardCopy = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 20px;
`

const StyledImage = styled(Image)`
    position: absolute;
    bottom: 0;
    right: 0;
    object-fit: contain;
    object-position: bottom center;
`;