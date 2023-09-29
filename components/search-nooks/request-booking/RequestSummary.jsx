"use client";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled } from "styled-components";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";
import { formatCurrency } from "@/utils/currencyFormatter";

export default function RequestSummary({ draftData }) {
   const searchParams = useSearchParams();
   const locationImage = searchParams.get("locationImage");

   return (
      <Track>
         <Wrapper>
            <NookPreview>
               <Image
                  loader={supabaseLoader}
                  alt=""
                  src={`/user-images/${locationImage}`}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover", borderRadius: "5px" }}
               />
               <TitleWrapper>
                  <Para size="textmd" $weight="semibold" color="black">
                     {draftData?.nooks.location_name}
                  </Para>
                  <LocationWrapper>
                     <Image
                        alt="location-pin"
                        src="/location-pin-grey.svg"
                        width={15}
                        height={15}
                        style={{ transform: "translateY(3px)" }}
                     />
                     <Para
                        size="textsm"
                        $weight="regular"
                        color="black"
                        style={{ textOverflow: "ellipsis" }}
                     >
                        {draftData?.nooks.location_address},{" "}
                        {draftData?.nooks.location_city},{" "}
                        {draftData?.nooks.location_state_code},{" "}
                        {draftData?.nooks.location_zip}
                     </Para>
                  </LocationWrapper>
               </TitleWrapper>
            </NookPreview>
            <Divider style={{ width: "100%" }} />
            <Calculation>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     Start date
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {draftData?.start_date}
                  </Para>
               </LineItem>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     End date
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {draftData?.end_date}
                  </Para>
               </LineItem>
            </Calculation>
            <Divider style={{ width: "100%" }} />
            <Calculation>
               <LineItem>
                  {draftData?.nooks.price_type === "dailyRate" ? (
                     <>
                        <Para size="textmd" $weight="regular">
                           {formatCurrency(draftData?.nooks.price)} x{" "}
                           {draftData?.days_count} days
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {formatCurrency(draftData?.booking_price)}
                        </Para>
                     </>
                  ) : (
                     <>
                        <Para size="textmd" $weight="regular">
                           Days
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {draftData?.days_count}
                        </Para>
                     </>
                  )}
               </LineItem>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     Processing
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {formatCurrency(draftData?.processing_fee)}
                  </Para>
               </LineItem>
            </Calculation>
            <Divider style={{ width: "100%" }} />
            <Calculation>
               <LineItem>
                  <Para size="textmd" $weight="medium">
                     Total before taxes
                  </Para>
                  <Para size="textmd" $weight="medium">
                     {formatCurrency(
                        draftData?.booking_price_total_before_taxes
                     )}
                  </Para>
               </LineItem>
            </Calculation>
         </Wrapper>
      </Track>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 25px;
   position: sticky;
   top: 140px;
   height: auto;
   box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.12);
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
   background-color: #fcfafa;
   padding: 30px;
   border-radius: 12px;
   width: 450px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      width: 100%;
   }
`;

const Track = styled.div`
   height: 100%;
   position: relative;
`;

const Calculation = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 15px;
   align-items: start;
   width: 100%;
`;

const LineItem = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   width: 100%;
`;

const NookPreview = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 0px;
   width: 100%;
   justify-content: center;
`;

const LocationWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: start;
   width: 100%;
`;
