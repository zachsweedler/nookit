import React from "react";
import { useFormContext } from "react-hook-form";
import { Section } from "./Styles";
import { ProfileLogoUploader } from "@/components/image-uploaders/profile-logo/ProfileLogoUploader";
import styled from "styled-components";
import { Para } from "@/styles/Typography";
import Select from "@/styles/Select";
import { industries } from "@/utils/industries";
import Input from "@/styles/Input";
import { profileTypes } from "@/utils/profileTypes";
import Textarea from "@/styles/Textarea";

export default function MissingProfileInfo({ id, nullProfileFields }) {

   const {
      formState: { errors },
      register,
   } = useFormContext();

  
   return (
      <>
         <Section id={id}>
            <Wrapper>
               <TitleWrapper>
                  <Para size="textmd" $weight="medium">
                     Profile
                  </Para>
                  <Para size="textsm" $weight="regular">
                     Please complete your profile.
                  </Para>
               </TitleWrapper>
               <FieldsWrapper>
                  {nullProfileFields?.map((field, index) => {
                     let label;
                     let component;
                     switch (field) {
                        case "first_name":
                           label = "First Name";
                           component = (
                              <Input
                                 fieldName={field}
                                 label={label}
                                 register={register}
                                 errors={errors}
                              />
                           );
                           break;
                        case "last_name":
                           label = "Last Name";
                           component = (
                              <Input
                                 fieldName={field}
                                 label={label}
                                 register={register}
                                 errors={errors}
                              />
                           );
                           break;
                        case "name":
                           label = "Profile Name";
                           component = (
                              <Input
                                 fieldName={field}
                                 label={label}
                                 register={register}
                                 errors={errors}
                              />
                           );
                           break;
                        case "website":
                           label = "Website";
                           component = (
                              <Input
                                 fieldName={field}
                                 label={label}
                                 register={register}
                                 errors={errors}
                              />
                           );
                           break;
                        case "industry":
                           label = "Industry";
                           component = (
                              <Select
                                 fieldName={field}
                                 label={label}
                                 options={industries}
                                 register={register}
                                 errors={errors}
                              />
                           );
                           break;
                        case "about":
                        label = "About";
                        component = (
                           <Textarea
                              fieldName={field}
                              label={label}
                              register={register}
                              errors={errors}
                           />
                        );
                        case "type":
                        label = "Type";
                        component = (
                           <Select
                              fieldName={field}
                              label={label}
                              options={profileTypes}
                              register={register}
                              errors={errors}
                           />
                        );
                        break;
                        case "logo":
                           component = <ProfileLogoUploader />;
                           break;
                     }
                     return <div key={index}>{component}</div>;
                  })}
               </FieldsWrapper>
            </Wrapper>
         </Section>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 50px;
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 5px;
`;

const FieldsWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 50px;
`;
