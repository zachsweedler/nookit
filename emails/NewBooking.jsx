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
   row,
   section,
   heading,
   button,
} from "./emailStyles";

export const DeclinedBooking = ({
   guestLogo = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/fallback_images/fallback_company_logo.svg?t=2023-09-24T15%3A01%3A21.081Z",
   guestName = "Rowing Blazers",
   locationName = "Devoción, Dumbo",
   locationAddress = "100 Front St, Brooklyn, NY, 11201",
   locationImage = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/user-images/ac757734-5615-45c5-b406-9146286a11a4/nooks/6b789ace-2253-45d4-a810-88b33bd81564/space/RB-Store-Opening-19_v2-scaled%20(1).webp?t=2023-09-24T15%3A41%3A11.216Z",
   startDate = "Saturday, June 12th, 2023",
   endDate = "Monday, June 14th, 2023",
   nookitLogoImage = `https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/brand/nookit-logo-black.png`,
}) => {
   const previewText = `Booking Request Declined`;
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
                        New booking request from {guestName}
                     </Heading>
                  </Row>
                  <Row style={row}>
                     <Column style={{ width: "0%", paddingRight: "12px" }}>
                        <Img
                           src={supabaseLoader + `users-images/${guestLogo}`}
                           width={50}
                           height={50}
                           style={avatar}
                        />
                     </Column>
                     <Column>
                        <Text style={paraBold}>{guestName}</Text>
                        <Text style={paraReg}>Guest</Text>
                     </Column>
                  </Row>
                  <Row style={row}>
                     <Button
                        href={`https://nookit.app/bookings/${payload.record.id}`}
                        pY={12}
                        style={button}
                     >
                        View Booking in Nookit
                     </Button>
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
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
                          Host fee
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
                           Your payout
                        </Text>
                     </Column>
                     <Column style={{ textAlign: "end" }}>
                        <Text style={paraBold}>
                           ${bookingPrice - processingFee}
                        </Text>
                     </Column>
                  </Row>
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
