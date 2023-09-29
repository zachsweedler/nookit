import React from "react";
import { useFormContext } from "react-hook-form";
import { Section } from "./Styles";
import { CompanyLogoUploader } from "@/components/image-uploaders/company-logo/CompanyLogoUploader";
import styled from "styled-components";
import { Para } from "@/styles/Typography";
import Select from "@/styles/Select";
import { industries } from "@/utils/industries";
import Input from "@/styles/Input";

export default function MissingCompanyInfo({ id, nullCompanyFields }) {

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
                     Company Profile
                  </Para>
                  <Para size="textsm" $weight="regular">
                     Please complete your company profile.
                  </Para>
               </TitleWrapper>
               <FieldsWrapper>
                  {nullCompanyFields?.map((field, index) => {
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
                           label = "Company Name";
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
                        case "logo":
                           component = <CompanyLogoUploader />;
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
