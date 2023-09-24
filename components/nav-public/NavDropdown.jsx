"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

export default function NavDropdown({
   isVisible,
   toggleDropdownVisibility,
   mobile,
   session,
}) {
   const supabase = createClientComponentClient();
   const router = useRouter();
   const dropdownRef = useRef();

   const loggedInItems = [
      { id: 1, title: "Bookings", href: "/bookings/guest" },
      { id: 2, title: "My Nooks", href: "/my-nooks" },
      { id: 3, title: "Account", href: "/account" },
      { id: 4, title: "Sign Out", href: "/" },
   ];

   const loggedOutItems = [
      { id: 1, title: "Log In", href: "/login" },
      { id: 2, title: "Sign Up", href: "/login" },
      { id: 3, title: "Browse Nooks", href: "/s" },
   ];

   useEffect(() => {
      function handleClickOutside(event) {
         if (isVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            toggleDropdownVisibility();
         }
      }
      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, [isVisible, toggleDropdownVisibility]);

   const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.log("error signing out", error.message);
      } else {
         router.push("/login");
         location.reload();
      }
   };

   return (
      isVisible && (
         <Wrapper $mobile={mobile} ref={dropdownRef}>
            {(!session ? loggedOutItems : loggedInItems).map((item, index) => (
               <Link
                  key={item.id}
                  href={item.href}
                  style={{ textDecoration: "none" }}
               >
                  <MenuItem
                     $mobile={mobile}
                     onClick={() => {
                        toggleDropdownVisibility();
                        if (item.title === "Sign Out") handleSignOut();
                     }}
                  >
                     {item.title}
                  </MenuItem>
               </Link>
            ))}
         </Wrapper>
      )
   );
}

const Wrapper = styled.div`
   position: absolute;
   top: ${({ $mobile }) => ($mobile ? "90px" : "calc(100% + 15px)")};
   right: ${({ $mobile }) => ($mobile ? "auto" : "0")};
   background-color: ${({ theme }) => theme.color.white};
   border-radius: ${({ $mobile }) => ($mobile ? "0" : "10px")};
   box-shadow: 0 ${({ $mobile }) => ($mobile ? "20px" : "2px")} 16px
      rgba(0, 0, 0, 0.12);
   width: ${({ $mobile }) => ($mobile ? "100vw" : "250px")};
   padding: ${({ $mobile }) => ($mobile ? "0px 0px" : "10px 0px")};
   border-top: ${({ $mobile, theme }) =>
      $mobile ? `1px solid ${theme.color.primary.grey.g25}` : "none"};
   ${({ $mobile, theme }) =>
      $mobile
         ? `
      @media screen and (min-width: ${theme.breakPoint.tablet}) {
         display: none;
      }
      `
         : `
      @media screen and (max-width: ${theme.breakPoint.tablet}) {
         display: none;
      }
      `}
`;

const MenuItem = styled.div`
   padding: ${({ $mobile }) => ($mobile ? "20px 30px" : "15px 20px")};
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   &:hover {
      background-color: ${({ theme }) => theme.color.primary.grey.g25};
   }
`;
