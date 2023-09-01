"use client";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import Link from "next/link";
import { styled } from "styled-components";

export default function Footer({ color }) {
   return (
      <Wrapper $brandcolor={color}>
         <Container size="xl">
            <Grid>
               <Brand>
                  <Link href="/" style={{ textDecoration: "none" }}>
                     <Para
                        color="primary.grey.b900"
                        size="textxl"
                        weight="medium"
                        style={{ color: "inherit" }}
                     >
                        nookit
                     </Para>
                  </Link>
                  <Para
                     size="textsm"
                     weight="regular"
                     color="primary.grey.g600"
                     style={{ color: "inherit" }}
                  >
                     ©2023 Nookit, LLC. All rights reserved.
                  </Para>
               </Brand>
               <Menu>
                  <MenuColumn>
                     <MenuList>
                        <Para
                           size="textmd"
                           weight="medium"
                           style={{ color: "inherit" }}
                        >
                           Social
                        </Para>
                        <a href="https://www.instagram.com/nookitapp/" target="_blank">
                           <Para
                              $isLink="true"
                              size="textmd"
                              weight="regular"
                              style={{ color: "inherit" }}
                           >
                              Instagram
                           </Para>
                        </a>
                        <a href="http://www.tiktok.com/@nookitapp" target="_blank">
                           <Para
                              $isLink="true"
                              size="textmd"
                              weight="regular"
                              style={{ color: "inherit" }}
                           >
                              Tiktok
                           </Para>
                        </a>
                        <a href="https://youtube.com/@nookitapp?feature=shared" target="_blank">
                           <Para
                              $isLink="true"
                              size="textmd"
                              weight="regular"
                              style={{ color: "inherit" }}
                           >
                              YouTube
                           </Para>
                        </a>
                     </MenuList>
                     <MenuList>
                        <Para
                           size="textmd"
                           weight="medium"
                           style={{ color: "inherit" }}
                        >
                           Press
                        </Para>

                        <Para
                           size="textmd"
                           weight="regular"
                           style={{ color: "inherit" }}
                        >
                           press@nookit.app
                        </Para>
                     </MenuList>
                  </MenuColumn>
                  <MenuColumn>
                     <MenuList>
                        <Para
                           size="textmd"
                           weight="medium"
                           style={{ color: "inherit" }}
                        >
                           Legal
                        </Para>
                        <Link href="/terms">
                           <Para
                              $isLink="true"
                              size="textmd"
                              weight="regular"
                              style={{ color: "inherit" }}
                           >
                              Terms of Service
                           </Para>
                        </Link>
                        <Link href="/privacy">
                           <Para
                              $isLink="true"
                              size="textmd"
                              weight="regular"
                              style={{ color: "inherit" }}
                           >
                              Privacy Policy
                           </Para>
                        </Link>
                     </MenuList>
                     <MenuList>
                        <Para
                           size="textmd"
                           weight="medium"
                           style={{ color: "inherit" }}
                        >
                           Contact
                        </Para>
                        <Para
                           size="textmd"
                           weight="regular"
                           style={{ color: "inherit" }}
                        >
                           contact@nookit.app
                        </Para>
                     </MenuList>
                  </MenuColumn>
               </Menu>
            </Grid>
         </Container>
      </Wrapper>
   );
}

const getBackgroundColor = ({ theme, $brandcolor, $whitecolor }) => {
   if ($brandcolor) return theme.color.primary.brand.b600;
   if ($whitecolor) return theme.color.white;
   return theme.color.white; // Default value
};

const getTextColor = ({ theme, $brandcolor, $whitecolor }) => {
   if ($brandcolor) return theme.color.white;
   if ($whitecolor) return theme.color.black;
   return theme.color.black; // Default value
};

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   padding: 150px 0px;
   background-color: ${getBackgroundColor} !important;
   color: ${getTextColor} !important;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 100px 0px;
   }
`;

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr auto;
   gap: 50px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
   }
`;

const Brand = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   gap: 12px;
`;

const Menu = styled.div`
   display: flex;
   flex-direction: row;
   height: 100%;
   column-gap: 50px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      flex-direction: column;
      row-gap: 50px;
   }
`;

const MenuColumn = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   grid-template-rows: 1fr auto;
   grid-row-gap: 50px;
   flex-direction: column;
`;

const MenuList = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 10px;
`;
