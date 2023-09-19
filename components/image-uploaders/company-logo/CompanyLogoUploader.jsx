/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { updateLogo } from "@/slices/companyLogoSlice";
import { useDispatch, useSelector } from "react-redux";
import supabaseLoader from "@/supabase-image-loader";

export function CompanyLogoUploader() {
   const logoInputRef = useRef();
   const [error, setError] = useState();
   const [userId, setUserId] = useState();
   const [companyId, setCompanyId] = useState();
   const [imgSrc, setImgSrc] = useState();
   const supabase = createClientComponentClient();
   const router = useRouter();
   const dispatch = useDispatch();
   const logo = useSelector((state) => state.companyLogo.path);
   const handleEditClick = () => logoInputRef.current.click();

   useEffect(() => {
      const fetchData = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            setUserId(user.id);
         }
         if (userId) {
            const { data, error } = await supabase
               .from("company_profiles")
               .select("id, logo")
               .eq("user_id", userId);
            if (error) {
               console.log("error company id", error);
            } else {
               setCompanyId(data[0]?.id);
               dispatch(updateLogo({ path: data[0]?.logo }));
            }
         }
      };
      fetchData();
   }, [supabase, dispatch, userId, router]);

   const handleVersionUpsert = async (timestamp, companyId, path) => {
      const { data, error } = await supabase
         .from("company_profiles")
         .upsert({ id: companyId, logo: path, logo_v: `${timestamp}` })
         .select()
         .eq("id", companyId);
      if (error) {
         console.log("Upsert version error", error);
      } else {
         dispatch(updateLogo({ path: data[0]?.logo }));
      }
   };

   // the meat and gravy
   const handleLogoUpload = async (e) => {
      const file = e.target.files[0];
      if (file && userId && companyId) {
         const timestamp = Date.now();
         const objectKey = `${userId}/company_logo/logo?version=${timestamp}`;
         const { data, error } = await supabase.storage
            .from("user-images")
            .upload(objectKey, file, {
               upsert: true,
               cacheControl: "3600",
            });
         if (error) {
            setError(error.message);
         } else {
            await handleVersionUpsert(timestamp, companyId, data.path);
         }
      }
   };

   useEffect(() => {
      const path = logo.path
         ? `user-images/${logo.path}`
         : "assets/fallback_images/fallback_company_logo.svg";
      setImgSrc(path)
   }, [logo.path]);

   return (
      <div
         style={{
            flexDirection: "column",
            gap: "14px",
            display: "flex",
            alignItems: "start",
            position: "relative",
         }}
      >
         <>
            <Wrapper>
               <AvatarWrapper onClick={(e) => e.stopPropagation()}>
                  {imgSrc && <Image loader={supabaseLoader} src={imgSrc} alt="User Avatar" {...imageProps} />}
               </AvatarWrapper>
               <EditButton onClick={handleEditClick}>
                  <Image
                     src="/edit-icon-black.svg"
                     width={15}
                     height={15}
                     alt="Edit Icon"
                  />
                  <input
                     type="file"
                     ref={logoInputRef}
                     onChange={handleLogoUpload}
                     style={{ display: "none" }}
                  />
               </EditButton>
            </Wrapper>
            {error && (
               <Para color="red" size="textxs" $weight="regular">
                  {error}
               </Para>
            )}
         </>
      </div>
   );
}

const imageProps = {
   fill: true,
   priority: true,
   sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
   style: {
      borderRadius: "100%",
      overflow: "hidden",
      cursor: "pointer",
      objectFit: "cover",
   },
};

const Wrapper = styled.div`
   position: relative;
   width: fit-content;
   height: fit-content;
`;

const AvatarWrapper = styled.div`
   width: 120px;
   height: 120px;
   border-radius: 100%;
   overflow: hidden;
   padding: 0;
`;

const EditButton = styled.div`
   width: auto;
   height: auto;
   padding: 12px;
   bottom: 0;
   right: 0;
   position: absolute;
   z-index: 12;
   border-radius: 100%;
   background-color: ${({ theme }) => theme?.color.primary.grey.g25};
   &:hover {
      background-color: ${({ theme }) => theme?.color.primary.grey.g50};
      cursor: pointer;
   }
`;
