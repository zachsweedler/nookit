"use client";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { styled, useTheme } from "styled-components";
import NavDropdown from "./NavDropdown";
import { useDispatch, useSelector } from "react-redux";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { updateLogo } from "@/slices/profileLogoSlice";
import supabaseLoader from "@/supabase-image-loader";
import { useUserSession } from "@/hooks/client-side/useUserSession";
import { restartForm } from "@/slices/nookFormSlice";

export default function NavPublic() {
   const pathname = usePathname();
   const [isVisible, setIsVisible] = useState(false);
   const [imgSrc, setImgSrc] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isScrolled, setIsScrolled] = useState(false);
   const [isDesktop, setIsDesktop] = useState();
   const logo = useSelector((state) => state.profileLogo.path);
   const dispatch = useDispatch();
   const supabase = createClientComponentClient();
   const session = useUserSession(supabase);

   useEffect(() => {
      const handleScroll = () => {
         // Set isScrolled to true if the scroll position is greater than 0
         setIsScrolled(window.scrollY > 0);
      };

      const updateMedia = () => {
         setIsDesktop(window.innerWidth > 1000);
      };

      window.addEventListener("resize", updateMedia);
      updateMedia();
      window.addEventListener("scroll", handleScroll);

      return () => {
         // Clean up the event listener on component unmount
         window.removeEventListener("scroll", handleScroll);
         window.removeEventListener("resize", updateMedia);
      };
   }, []);

   useEffect(() => {
      setLoading(true);
      const fetchData = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data, error } = await supabase
               .from("profiles")
               .select("logo")
               .eq("user_id", user?.id);
            if (error) {
               console.log("error logo", error);
            } else {
               dispatch(updateLogo({ path: data[0]?.logo || null }));
            }
         }
         setLoading(false);
      };
      fetchData();
   }, [dispatch, supabase]);

   useEffect(() => {
      const path = logo?.path
         ? `user-images/${logo?.path}`
         : "assets/fallback_images/fallback_profile_logo.svg";
      setImgSrc(path);
   }, [logo?.path, loading]);

   const toggleDropdownVisibility = () => {
      setIsVisible(!isVisible);
   };

   return (
      <Wrapper
         $pathname={pathname}
         $isScrolled={isScrolled}
         $isVisible={isVisible}
         $isDesktop={isDesktop}
      >
         <Container
            size="xl"
            style={{
               display: "flex",
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "space-between",
            }}
         >
            <Link href="/" style={{ textDecoration: "none" }}>
               <Image
                  alt="nookit-logo"
                  src="/nookit-logo-black.svg"
                  width={76}
                  height={30}
               />
            </Link>
            <MenuWrapper>
               <Link href="/s">
                  <NavItem size="textmd" $weight="regular">
                     Browse Nooks
                  </NavItem>
               </Link>
               <Link href="/my-nooks">
                  <NavItem
                     size="textmd"
                     $weight="regular"
                     onClick={() => dispatch(restartForm())}
                  >
                     List Your Nook
                  </NavItem>
               </Link>
               {!session ? (
                  <>
                     <AuthButtons $pathname={pathname}>
                        <Link href="/signup">
                           <SignUpButton>Sign Up</SignUpButton>
                        </Link>
                        <Link href="/login">
                           <NavItem size="textmd" $weight="regular">
                              Log in
                           </NavItem>
                        </Link>
                     </AuthButtons>
                     <MenuIcon
                        alt="menu-icon"
                        src="/menu-icon-black.svg"
                        width={25}
                        height={25}
                        onClick={toggleDropdownVisibility}
                     />
                  </>
               ) : (
                  <AvatarWrapper onClick={toggleDropdownVisibility}>
                     <Avatar>
                        <Image
                           loader={supabaseLoader}
                           alt="business_logo"
                           fill={true}
                           style={{ objectFit: "cover", borderRadius: "100%" }}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           src={imgSrc}
                        />
                        <NavDropdown
                           isVisible={isVisible}
                           mobile={false}
                           session={session}
                           toggleDropdownVisibility={toggleDropdownVisibility}
                        />
                     </Avatar>
                     <Image
                        alt="arrow-icon"
                        width={12}
                        height={12}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src="/down-arrow-black.svg"
                     />
                  </AvatarWrapper>
               )}
            </MenuWrapper>
         </Container>
         <NavDropdown
            isVisible={isVisible}
            mobile={true}
            session={session}
            toggleDropdownVisibility={toggleDropdownVisibility}
         />
      </Wrapper>
   );
}

const Wrapper = styled.div`
   width: 100vw;
   height: 70px;
   align-items: center;
   justify-content: space-between;
   display: flex;
   position: fixed;
   top: 0;
   z-index: 1000;
   border-bottom: ${({ $isScrolled, theme }) =>
      $isScrolled ? `1px solid ${theme.color.primary.grey.g50}` : "none"};
   background-color: ${({ $isVisible, $isScrolled, $isDesktop, theme }) =>
      ($isVisible && !$isDesktop) || $isScrolled
         ? `${theme.color.white}`
         : "none"};
`;

const AuthButtons = styled.div`
   width: auto;
   height: auto;
   display: flex;
   align-items: center;
   flex-direction: row;
   column-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const SignUpButton = styled.button`
   background-color: ${({ theme }) => theme.color.black};
   font-size: ${({ theme }) => theme.fontSize.textmd};
   color: white;
   padding: 12px 18px;
   border-radius: 5px;
   &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.color.primary.brand.b600};
   }
`;

const Avatar = styled.div`
   width: 30px;
   height: 30px;
   position: relative;
   border-radius: 0px;
   flex-shrink: 0;
   display: flex;
   flex-direction: row;
   column-gap: 3px;
   align-items: center;
   transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
   &:hover {
      box-shadow: 0px 0px 0px 4px #9696967c;
      cursor: pointer;
      border-radius: 100%;
   }
`;

const AvatarWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 9px;
   align-items: center;
`;

const MenuIcon = styled(Image)`
   display: none;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: block;
   }
`;

const MenuWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 30px;
   align-items: center;
`;

const NavItem = styled(Para)`
   display: flex;
   &:hover {
      color: ${({ theme }) => theme.color.primary.brand.b600};
      border-radius: 5px;
      text-decoration: none;
      cursor: pointer;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;
