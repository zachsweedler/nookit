"use client";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import NavDropdown from "./NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useUserSession } from "@/hooks/useUserSession";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { updateLogo } from "@/slices/companyLogoSlice";
import supabaseLoader from "@/supabase-image-loader";

export default function NavPublic() {
   const pathname = usePathname();
   const [isVisible, setIsVisible] = useState(false);
   const [imgSrc, setImgSrc] = useState(null);
   const [loading, setLoading] = useState(true);
   const logo = useSelector((state) => state.companyLogo.path);
   const session = useUserSession();
   const dispatch = useDispatch();
   const supabase = createClientComponentClient();

   useEffect(() => {
      setLoading(true);
      const fetchData = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data, error } = await supabase
               .from("company_profiles")
               .select("logo")
               .eq("user_id", user?.id);
            if (error) {
               console.log("error logo", error);
            } else {
               dispatch(updateLogo({ path: data[0]?.logo }));
            }
         }
         setLoading(false);
      };
      fetchData();
   }, [dispatch, supabase]);

   useEffect(() => {
      console.log('loading', loading)
      const path = logo?.path
         ? `user-images/${logo?.path}`
         : "assets/fallback_images/fallback_company_logo.svg";
      setImgSrc(path);
   }, [logo?.path, loading]);

   const toggleDropdownVisibility = () => {
      setIsVisible(!isVisible);
   };

   return (
      <Wrapper $pathname={pathname}>
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
               <Para
                  color="primary.grey.b900"
                  size="textxl"
                  weight="medium"
                  style={{ cursor: "pointer" }}
               >
                  nookit
               </Para>
            </Link>
            {!session ? (
               pathname === "/waitlist/form" ? null : (
                  !loading &&
                  <AuthButtons $pathname={pathname}>
                     <Link href="/sign-in">
                        <Button $blackcolor='true'>Join Waitlist</Button>
                     </Link>
                  </AuthButtons>
               )
            ) : (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     rowGap: "5px",
                     position: "relative",
                  }}
               >
                  <LogoWrapper onClick={toggleDropdownVisibility}>
                     <Image
                        loader={supabaseLoader}
                        alt="business_logo"
                        fill={true}
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={imgSrc}
                     />
                  </LogoWrapper>
                  <NavDropdown
                     isVisible={isVisible}
                     toggleDropdownVisibility={toggleDropdownVisibility}
                  />
               </div>
            )}
         </Container>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   width: 100vw;
   height: 90px;
   background-color: ${({ theme, $pathname }) =>
      $pathname === "/sign-in" ? "transparent" : theme.color.white};
   align-items: center;
   justify-content: space-between;
   display: flex;
   position: fixed;
   top: 0;
   z-index: 1000;
`;

const AuthButtons = styled.div`
   width: auto;
   height: auto;
   display: flex;
   align-items: center;
   flex-direction: row;
   column-gap: 30px;
   display: ${({ $pathname }) => ($pathname === "/sign-in" ? "none" : "flex")};
`;

const LogoWrapper = styled.div`
   width: 30px;
   height: 30px;
   position: relative;
   border-radius: 100%;
   overflow: hidden;
   transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
   &:hover {
      transform: scale(0.9);
      box-shadow: 0px 0px 0px 4px #9696967c;
      cursor: pointer;
      border-radius: 100%;
   }
`;
