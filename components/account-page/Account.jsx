"use client";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import Link from "next/link";
import { styled } from "styled-components";
import PageHeader from "../page-header/PageHeader";
import { Divider } from "@/styles/mui/Divider";

export default function Account() {
   
   const menuItems = [
      {
         title: "Profile",
         href: "/account/profile",
         src: "/profile-icon-black.svg",
      },
      {
         title: "Payments & Payouts",
         href: "/account/payments-payouts",
         src: "/dollar-icon-black.svg",
      },
   ];

   return (
      <Container
         size="md"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
         }}
      >
         <Grid>
            <PageHeader title="Account" />
            <Divider />
            <MenuWrapper>
               {menuItems.map((item, index) => (
                  <Link key={index} href={item.href}>
                     <MenuItemWrapper>
                        <ItemIcon>
                           <Image
                              alt="account-icon"
                              src={item.src}
                              width={30}
                              height={30}
                           />
                           <MenuItem size="textlg" $weight="medium">
                              {item.title}
                           </MenuItem>
                        </ItemIcon>
                        <Image
                           alt="next-icon"
                           src="/arrow-icon-right-black.svg"
                           width={12}
                           height={12}
                        />
                     </MenuItemWrapper>
                  </Link>
               ))}
            </MenuWrapper>
         </Grid>
      </Container>
   );
}

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   grid-template-rows: auto;
   grid-gap: 30px;
`;

const MenuWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 18px;
`;

const ItemIcon = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;

const MenuItemWrapper = styled.div`
   position: relative;
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   padding: 15px 12px;
   align-items: center;
   border-radius: 5px;
   justify-content: space-between;
   &:hover {
      background-color: ${({ theme }) => theme.color.primary.grey.g25};
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 15px 0px;
      &:hover {
         background-color: transparent;
      }
   }
`;

const MenuItem = styled(Para)`
   border-radius: 5px;
`;
