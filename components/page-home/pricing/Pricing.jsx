import { styled } from "styled-components";
import PricingCard from "./PricingCard";

export default function Pricing() {
   return (
      <>
            <Wrapper>
                <Container>
                   <PricingCard style={{position: "absolute"}}/>
                </Container>
            </Wrapper>

      </>
   );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${({ theme }) => theme.container.lg};
    padding: 0px 30px;
    @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        padding: 100px 0px;
    }
`
const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 50px;
   width: 100vw;
   height: 100vh;
   position: relative;
   background-size: cover;
   background-repeat: no-repeat;
   background-image: url('https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/marketing/home/pricing/pricing-image.jpg?t=2023-08-30T14%3A22%3A31.986Z');
   @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        padding: 0px 30px;
        background-image: none;
        height: fit-content;
    }
`;