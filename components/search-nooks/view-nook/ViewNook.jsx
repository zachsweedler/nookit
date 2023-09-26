"use client";
import Footer from "@/components/home-page/footer/Footer";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { styled } from "styled-components";
import Main from "./main/Main";
import { setViewNook } from "@/slices/viewNookSlice";
import { useDispatch } from "react-redux";
import LocationImages from "./location-images/LocationImages";

export default function ViewNook() {
   const supabase = createClientComponentClient();
   const dispatch = useDispatch();
   const params = useParams();

   useEffect(() => {
      if (params) {
         const fetchNook = async () => {
            const { data, error } = await supabase
               .from("nooks")
               .select(`*, company_profiles(name, logo)`)
               .eq("id", params?.slug);
            if (error) {
               console.error("error fetching nook", error);
            } else {
               dispatch(setViewNook(data));
            }
         };
         fetchNook();
      }
   }, [dispatch, params, supabase]); // Empty dependency array to run the effect only once

   return (
      <Wrapper>
         <ImageMainWrapper>
            <LocationImages />
            <Container size="lg">
               <Main />
            </Container>
         </ImageMainWrapper>
         <Footer />
      </Wrapper>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
`;

const ImageMainWrapper = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   grid-row-gap: 70px;
`;
