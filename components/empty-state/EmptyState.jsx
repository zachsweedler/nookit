'use client'
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

export default function EmptyState({
   title,
   description,
   imgSrc,
   button,
   buttonHref,
   onButtonClick,
}) {
   return (
      <Container size="xs">
        <Wrapper>
            {imgSrc &&
                <ImageWrapper>
                <Image alt="add-payout-image" src={imgSrc} fill={true} style={{marginBottom: "30px", objectFit: "contain"}}/>
                </ImageWrapper>
            }
            <CopyWrapper>
                <Para size="textlg" $weight="medium">
                    {title}
                </Para>
                <Para size="textmd" $weight="regular">
                    {description}
                </Para>
            </CopyWrapper>
            <Link href={buttonHref ? buttonHref : "#"}>
                <Button onClick={onButtonClick} $brandcolor={true} style={{ width: "auto" }}>{button}</Button>
            </Link>
         </Wrapper>
      </Container>
   );
}


const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: column;
    row-gap: 30px;
    text-align: center;
    align-items: center;
    justify-content: center;
`

const ImageWrapper = styled.div`
    width: 100%;
    height: 250px;
    position: relative;
`


const CopyWrapper = styled.div`
    display: flex;
    height: auto;
    flex-direction: column;
    row-gap: 5px;
    text-align: center;
    align-items: center;
    justify-content: center;
`