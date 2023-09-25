import React from "react";
import {
   Body,
   Button,
   Column,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Img,
   Preview,
   Row,
   Section,
   Text,
} from "@react-email/components";
import {
   avatar,
   body,
   container,
   footer,
   hr,
   paraBold,
   paraReg,
   receiptRow,
   row,
   section,
   heading,
   button,
} from "./emailStyles";

export const ConfirmedBooking = ({
   guestMailto = "mailto: zachryanco@gmail.com",
   guestLogo = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/fallback_images/fallback_company_logo.svg?t=2023-09-24T15%3A01%3A21.081Z",
   guestName = "Rowing Blazers",
   hostMailto = "mailto: zachryanco@gmail.com",
   hostLogo = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/fallback_images/fallback_company_logo.svg?t=2023-09-24T15%3A01%3A21.081Zs",
   hostName = "Devoción",
   locationName = "Devoción, Dumbo",
   locationAddress = "100 Front St, Brooklyn, NY, 11201",
   locationImage = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/user-images/ac757734-5615-45c5-b406-9146286a11a4/nooks/6b789ace-2253-45d4-a810-88b33bd81564/space/RB-Store-Opening-19_v2-scaled%20(1).webp?t=2023-09-24T15%3A41%3A11.216Z",
   startDate = "Saturday, June 12th, 2023",
   endDate = "Monday, June 14th, 2023",
   dailyRate = 114,
   daysCount = 3,
   bookingPrice = 320,
   processingFee = 60,
   nookitLogoImage = `https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/brand/nookit-logo-black.png`,
   forGuest = true,
}) => {
   const previewText = `Booking Confirmed!`;
   const supabaseLoader = `https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/`;

   return (
      <Html>
         <Head />
         <Preview>{previewText}</Preview>
         <Body style={body}>
            <Container style={container}>
               <Section style={section}>
                  <Row>
                     <Img src={nookitLogoImage} />
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
                  <Row style={row}>
                     <Heading as="h1" style={heading}>
                        {forGuest
                           ? `New booking confirmed! ${hostName} is expecting you to arrive on ${startDate}.`
                           : `New booking confirmed! ${guestName} is arriving on ${startDate}.`}
                     </Heading>
                  </Row>
                  <Row style={row}>
                     <Column style={{ width: "0%", paddingRight: "12px" }}>
                        <Img
                           src={
                              forGuest
                                 ? supabaseLoader + `user-images/${hostLogo}`
                                 : supabaseLoader + `user-images/${guestLogo}`
                           }
                           width={50}
                           height={50}
                           style={avatar}
                        />
                     </Column>
                     <Column>
                        <Text style={paraBold}>
                           {forGuest ? hostName : guestName}
                        </Text>
                        <Text style={paraReg}>
                           {forGuest ? "Your Host" : "Your Guest"}
                        </Text>
                     </Column>
                  </Row>
                  <Row style={row}>
                     <Button
                        href={forGuest ? hostMailto : guestMailto}
                        pY={12}
                        style={button}
                     >
                        Email {forGuest ? hostName : guestName}
                     </Button>
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section>
                  <Row style={row}>
                     <Img
                        src={supabaseLoader + locationImage}
                        width="100%"
                        height={200}
                        style={{
                           borderRadius: "5px",
                           overflow: "hidden",
                           objectFit: "cover",
                        }}
                     />
                  </Row>
                  <Row style={row}>
                     <Column>
                        <Text style={paraBold}>{locationName}</Text>
                        <Text style={paraReg}>{locationAddress}</Text>
                     </Column>
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
                  <Row>
                     <Column>
                        <Text style={paraBold}>Start Date:</Text>
                        <Text style={paraReg}>{startDate}</Text>
                     </Column>
                     <Column>
                        <Text style={paraBold}>End Date:</Text>
                        <Text style={paraReg}>{endDate}</Text>
                     </Column>
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
                  <Row style={receiptRow}>
                     <Column>
                        <Text style={paraReg}>
                           ${dailyRate} x {daysCount} days
                        </Text>
                     </Column>
                     <Column style={{ textAlign: "end" }}>
                        <Text style={paraReg}>${bookingPrice}</Text>
                     </Column>
                  </Row>
                  <Row style={receiptRow}>
                     <Column>
                        <Text style={paraReg}>
                           {forGuest ? "Processing" : "Host fee"}
                        </Text>
                     </Column>
                     <Column style={{ textAlign: "end" }}>
                        <Text style={paraReg}>${processingFee}</Text>
                     </Column>
                  </Row>
                  <Hr style={receiptRow} />
                  <Row style={receiptRow}>
                     <Column>
                        <Text style={paraBold}>
                           {forGuest ? "Total before taxes" : "Your payout"}
                        </Text>
                     </Column>
                     <Column style={{ textAlign: "end" }}>
                        <Text style={paraBold}>
                           $
                           {forGuest
                              ? bookingPrice + processingFee
                              : bookingPrice - processingFee}
                        </Text>
                     </Column>
                  </Row>
                  <Text style={paraReg}>
                     {forGuest
                        ? "ⓘ You won't be charged until after the bookings end date."
                        : "ⓘ Your payout won't be scheduled untila after the booking's end date."}
                  </Text>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
                  <Row>
                     <Text style={footer}>Nookit, Inc.</Text>
                  </Row>
               </Section>
            </Container>
         </Body>
      </Html>
   );
};

