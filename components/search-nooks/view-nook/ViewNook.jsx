"use client";
import Footer from "@/components/home-page/footer/Footer";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Main from "./main/Main";
import { setViewNook } from "@/slices/viewNookSlice";
import { useDispatch } from "react-redux";
import LocationImages from "./location-images/LocationImages";

export default function ViewNook() {
   const supabase = createClientComponentClient();
   const dispatch = useDispatch();
   const params = useParams();
   const [loading, setLoading] = useState();

   useEffect(() => {
      (async () => {
         setLoading(true);
         // Fetch nook
         const fetchedNook = await fetchNook();
         console.log('fetched nook', fetchedNook)

            // Fetch location images
            const fetchedLocationImages = await listLocationImages(fetchedNook);
            console.log("fetched location images", fetchedLocationImages);
            // Fetch nook images
            const fetchedNookImages = await listNookImages(fetchedNook);
            console.log("fetched nook images", fetchedNookImages);

            dispatch(
               setViewNook({
                  nook: fetchedNook,
                  location_images: fetchedLocationImages,
                  nook_images: fetchedNookImages
               })
            );

         setLoading(false);
      })();

      async function fetchNook() {
         const { data, error } = await supabase
            .from("nooks")
            .select(`*, locations(*), profiles(user_id, name, about, logo)`)
            .order("created_at", { ascending: false })
            .eq("id", params.slug);
         if (error) {
            console.error("error fetching nooks", error);
            return [];
         } else {
            console.log("nooks", data[0]);
            return data[0];
         }
      }

      async function listLocationImages(nook) {
         const { data: images, error } = await supabase.storage
            .from("user-images")
            .list(`${nook.user_id}/nooks/${nook.id}/space`);
         if (error) {
            console.log("error listing location images", error);
            return [];
         } else {
            const loadedImages = images.map((image) => image.name);
            return loadedImages.map(
               (image) => `${nook.user_id}/nooks/${nook.id}/space/${image}`
            );
         }
      }

      async function listNookImages(nook) {
         const { data: images, error } = await supabase.storage
            .from("user-images")
            .list(`${nook.user_id}/nooks/${nook.id}/nook`);
         if (error) {
            console.log("error listing nook images", error);
            return [];
         } else {
            const loadedImages = images.map((image) => image.name);
            return loadedImages.map(
               (image) => `${nook.user_id}/nooks/${nook.id}/nook/${image}`
            );
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

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
   flex-direction: column;
   row-gap: 70px;
`;
