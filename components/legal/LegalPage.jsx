'use client'
import Container from "@/styles/Containers"
import { H3, H5, Para } from "@/styles/Typography"
import { styled } from "styled-components"

export default function LegalPage ({title, content}) {

    return (
        <Wrapper>
            <Container size="md">
                <Content>
                    <H5 $weight="semibold">{title}</H5>
                    <Para size="textmd" $weight="regular">{content}</Para>
                </Content>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 150px 0px;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 50px;
`