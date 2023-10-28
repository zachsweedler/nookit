"use client";
import { Para } from "@/styles/Typography";
import Image from "next/image";
import { styled } from "styled-components";
import supabaseLoader from "@/supabase-image-loader";
import Link from "next/link";
import { GridCell } from "./HostBookings";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useRouter } from "next/navigation";

export default function BookingRow({ ...props }) {
   const router = useRouter();

   const handleClick = () => {
      router.push(`/bookings/${props.bookingId}`);
   };

   return (
      <Link
         href={
            props.status === "draft"
               ? `/s/${props.nookId}/request-booking?id=${props.bookingId}&locationImage=${props.locationImage}`
               : `/bookings/${props.bookingId}`
         }
         onClick={handleClick}
      >
         <GridRow>
            <Image
               loader={supabaseLoader}
               alt="nook-image"
               src={`user-images/${props.locationImage}`}
               width={50}
               height={50}
               style={{ objectFit: "cover", borderRadius: "5px" }}
            />
            <GridCell>
               <StyledPara size="textmd" $weight="medium">
                  {props.locationName}
               </StyledPara>
            </GridCell>
            <GridCell>
               <StyledPara size="textmd" $weight="regular">
                  {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
               </StyledPara>
            </GridCell>
            <GridCell>
               <Host>
                  <Image
                     loader={supabaseLoader}
                     alt="host-profile-logo"
                     src={
                        props.guestUserId === props.userId
                           ? props.hostLogo
                              ? `user-images/${props.hostLogo}`
                              : "/assets/fallback_images/fallback_profile_logo.svg"
                           : props.guestLogo
                           ? `user-images/${props.guestLogo}`
                           : "/assets/fallback_images/fallback_profile_logo.svg"
                     }
                     width={30}
                     height={30}
                     style={{ borderRadius: "100%", objectFit: "cover" }}
                  />
                  <StyledPara size="textmd" $weight="regular">
                     {props.guestUserId === props.userId
                        ? props.hostName
                        : props.guestName}
                  </StyledPara>
               </Host>
            </GridCell>
            <GridCell>
               <StyledPara size="textmd" $weight="regular">
                  {props.startDate}
               </StyledPara>
            </GridCell>
            <GridCell>
               <StyledPara size="textmd" $weight="regular">
                  {props.endDate}
               </StyledPara>
            </GridCell>
            <GridCell>
               <StyledPara size="textmd" $weight="regular">
                  {props.guestUserId === props.userId
                     ? `${formatCurrency(props.bookingPriceTotalBeforeTax)}`
                     : `${props.hostPayout}`}
               </StyledPara>
            </GridCell>
         </GridRow>
      </Link>
   );
}

const GridRow = styled.div`
   display: grid;
   grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 1fr;
   height: auto;
   padding: 20px;
   width: 100%;
   align-items: center;
   border-radius: 5px;
   &:hover {
      background-color: ${({ theme }) => theme.color.primary.grey.g25};
      cursor: pointer;
   }
`;

const Host = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   align-items: center;
   overflow: hidden;
`;

export const StyledPara = styled(Para)`
   text-overflow: ellipsis;
   display: block;
   white-space: nowrap;
   overflow: hidden;
   max-width: 100%;
`;
