"use client";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NookCard from "./NookCard";
import { styled } from "styled-components";
import { Para } from "@/styles/Typography";
import { useDispatch } from "react-redux";
import { setViewNook } from "@/slices/viewNookSlice";
import Loading from "../loading/Loading";
import EmptyState from "../empty-state/EmptyState";

export default function FetchNooks() {
   const [nooks, setNooks] = useState([]);
   const supabase = createClientComponentClient();
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const [loading, setLoading] = useState();

   useEffect(() => {
      const fetchNooks = async () => {
         setLoading(true);
         const { data, error } = await supabase
            .from("nooks")
            .select(`*, company_profiles(user_id, name, logo)`)
            .order('created_at', { ascending: false })
            .eq('status', 'listed');
         if (error) {
            console.error("error fetching nooks", error);
         } else {
            setLoading(false);
            setNooks(data);
            console.log('nooks', data)
         }
      };
      fetchNooks();
   }, [supabase]);

   return (
      <Container size="xl" style={{ marginTop: "120px" }}>
         {loading ? (
            <CenterWrapper>
               <Loading />
            </CenterWrapper>
         ) : nooks && nooks.length > 0 ? (
            <Grid>
               {nooks.map((nook, index) => (
                  <NookCard
                     key={index}
                     id={nook.id}
                     images={nook.location_images}
                     name={nook.location_name}
                     city={nook.location_city}
                     state={nook.location_state_code}
                     hostId={nook.company_id}
                     logo={nook.company_profiles.logo}
                     hostCompany={nook.company_profiles.name}
                  />
               ))}
            </Grid>
         ) : (
            <CenterWrapper>
               <EmptyState
                  title="No Nooks Found"
                  description="Looks like there are no nooks! Interested in hosting one at your store? Click the link below:"
                  button="Host a Nook"
                  buttonHref="/my-nooks"
               />
            </CenterWrapper>
         )}
      </Container>
   );
}

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   flex-direction: column;
   grid-column-gap: 30px;
   grid-row-gap: 60px;
   padding-bottom: 60px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 40px;
   }
`;

const CenterWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   height: calc(100vh - 300px);
`;
