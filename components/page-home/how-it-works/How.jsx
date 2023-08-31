"use client";
import Container from "@/styles/Containers";
import { H3 } from "@/styles/Typography";
import { styled } from "styled-components";
import StepCard from "./StepCard";

export default function How() {
   const cards = [
      {
         title: "Find a Nook",
         description:
            "Explore member’s spaces. Filter by available dates, host’s brand name, city, size, and more!",
         src: "/assets/marketing/home/how-it-works/how-it-works-1.svg",
      },
      {
         title: "Request to Book",
         description:
            "Bookings can be a fixed rate by the host retailer, or a percentage of sales paid to them. ",
         src: "/assets/marketing/home/how-it-works/how-it-works-2.svg",
      },
   ];

   return (
      <Container size="xl">
         <Wrapper>
            <H3 weight="semibold">How it works</H3>
            <Grid>
            {cards.map((card, index) => (
               <StepCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  src={card.src}
                  priority={true}
               />
            ))}
            </Grid>
         </Wrapper>
      </Container>
   );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 50px;
    padding: 150px 0px;
    @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 100px 0px;
   }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        grid-template-columns: 1fr;
    }
`