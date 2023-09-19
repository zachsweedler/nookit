"use clients";
import { Button } from "@/styles/Buttons";
import { H5, H6, Para } from "@/styles/Typography";
import Link from "next/link";
import { styled } from "styled-components";

export default function PageHeader({
   title,
   button,
   buttonLink,
   onButtonClick,
   onClick
}) {
   return (
      <>
         <Header>
            <H6 $weight="medium">
               {title}
            </H6>
            {button && (
               <Link
                  href={buttonLink || '/'}
                  style={{ textDecoration: "none" }}
                  onClick={onButtonClick}
               >
                  <Button $blackcolor="true" style={{ width: "fit-content" }} onClick={onClick}>
                     {button}
                  </Button>
               </Link>
            )}
         </Header>
      </>
   );
}

const Header = styled.div`
   width: 100%;
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`;
