"use client";
import Container from "@/styles/Containers";
import { H3, H4, H5, H6, Para } from "@/styles/Typography";
import styled from "styled-components";
import NookCard from "../search-nooks/NookCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";

export default function Profile() {
   const supabase = createClientComponentClient();
   const params = useParams();
   const [nooks, setNooks] = useState([]);
   const [company, setCompany] = useState([]);

   useEffect(() => {
      const fetchCompanyNooks = async () => {
         const { data, error } = await supabase
            .from("nooks")
            .select(`*`)
            .order("created_at", { ascending: false })
            .eq("status", "listed")
            .eq("company_id", params.slug);
         if (error) {
            console.log("error getting nooks", error);
         } else {
            console.log("data", data);
            setNooks(data);
         }
      };
      fetchCompanyNooks();
   }, [supabase, params.slug]);

   useEffect(() => {
      const fetchCompany = async () => {
         const { data, error } = await supabase
            .from("company_profiles")
            .select("created_at, about, user_id, name, logo, industry, website")
            .eq("id", params.slug);
         if (error) {
            console.log("error getting company", error);
         } else {
            console.log("data", data);
            setCompany(data[0]);
         }
      };
      fetchCompany();
   }, [supabase, params.slug]);

   const date = new Date(company?.created_at);
   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const joinedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

   let companyWebsite = company?.website?.toString();
   if (companyWebsite && companyWebsite.startsWith("https://")) {
      companyWebsite = companyWebsite.slice(8);
   }

   return (
      <Wrapper>
         <Container size="sm">
            <Content>
               <Header>
                  <ProfileAvatar>
                     <Image
                        loader={supabaseLoader}
                        alt="profile-avatar"
                        src={`user-images/${company.logo}`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                     />
                  </ProfileAvatar>
                  <H5>{company.name}</H5>
                  <Para size="textmd" $weight="regular">
                     Joined {joinedDate}
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {company.industry}
                  </Para>
                  <a href={`https://${companyWebsite}`} target="_blank">
                     <Para
                        $isLink={true}
                        size="textmd"
                        $weight="regular"
                        color="primary.brand.b600"
                     >
                        {company.website}
                     </Para>
                  </a>
               </Header>
               {company.about && (
                  <Section>
                     <Para size="textlg" $weight="medium">
                        About
                     </Para>
                     <Para size="textmd" $weight="regular">
                        {company.about}
                     </Para>
                  </Section>
               )}
               {nooks.length > 0 && (
                  <Section>
                     <Para size="textlg" $weight="medium">
                        Nooks
                     </Para>
                     <NooksGrid>
                        {nooks?.map((nook, index) => (
                           <NookCard
                              key={index}
                              id={nook.id}
                              images={nook?.location_images}
                              name={nook.location_name}
                              city={nook.location_city}
                              state={nook.location_state_code}
                              hostId={company.user_id}
                              logo={company.logo}
                              hostCompany={company.name}
                           />
                        ))}
                     </NooksGrid>
                  </Section>
               )}
            </Content>
         </Container>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   padding: 120px 0px;
`;

const Content = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 60px;
`;

const Header = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   align-items: center;
   justify-content: center;
`;

const Section = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   align-items: start;
`;

const NooksGrid = styled.div`
   display: grid;
   width: 100%;
   grid-template-columns: 1fr 1fr;
   grid-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 50px;
   }
`;

const ProfileAvatar = styled.div`
   width: 100px;
   height: 100px;
   border-radius: 100%;
   overflow: hidden;
   position: relative;
`;
