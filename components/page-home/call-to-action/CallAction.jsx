import { styled } from "styled-components";
import { H3, H4, Para } from "@/styles/Typography";
import { Button } from "@/styles/Buttons";
import Link from "next/link";

export default function CallAction() {
   return (
      <>
            <Wrapper>
                <Container>
                   <Para color="white" size="textmd" weight="regular">Get Started Now</Para>
                   <H3 color="white" weight="medium">Join the future of brick & mortar retail.</H3>
                   <Link href="/waitlist/dash">
                    <Button $whitecolor={true} style={{width: "fit-content"}}>Join Waitlist</Button>
                   </Link>
                </Container>
            </Wrapper>

      </>
   );
}


const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
   justify-content: center;
   background-color: ${({theme})=> theme.color.primary.brand.b600};
   padding: 150px 0px;
   @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
       align-items: start;
       justify-content: start;
       text-align: left;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 50px;
    max-width: ${({ theme }) => theme.container.lg};
    padding: 0px 30px;
    align-items: center;
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        align-items: start;
    }
`