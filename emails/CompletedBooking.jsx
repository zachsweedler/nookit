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
   button
} from "./emailStyles";


export const CompletedBooking = ({
   guestMailto = "mailto: zachryanco@gmail.com",
   guestLogo = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/fallback_images/fallback_profile_logo.png",
   guestName = "Rowing Blazers",
   hostMailto = "mailto: zachryanco@gmail.com",
   hostLogo = "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/fallback_images/fallback_profile_logo.png",
   hostName = "Devoción",
   locationName = "Devoción, Dumbo",
   locationAddress = "100 Front St, Brooklyn, NY, 11201",
   locationImage,
   startDate = "Saturday, June 12th, 2023",
   endDate = "Monday, June 14th, 2023",
   dailyRate = 114,
   daysCount = 3,
   bookingPrice = 320,
   processingFee = 60,
   nookitLogoImage = `https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/assets/brand/nookit-logo-black.png`,
   forGuest = false,
}) => {
   const previewText = `Booking Completed!`;
   const supabaseLoader = `https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/`;

   return (
      <Html>
         <Head />
         <Preview>{previewText}</Preview>
         <Body style={body}>
            <Container style={container}>
               <Section style={section}>
                  <Row>
                     <Img src={nookitLogoImage} width={76} height={23} />
                  </Row>
               </Section>
               <Hr style={hr} />
               <Section style={section}>
                  <Row style={row}>
                     <Heading as="h1" style={heading}>
                        {forGuest
                           ? `Your booking with ${hostName} is complete.`
                           : `Congrats! Your booking with ${guestName} is
                           complete.`}
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
                        <Text style={paraBold}>Date Started:</Text>
                        <Text style={paraReg}>{startDate}</Text>
                     </Column>
                     <Column>
                        <Text style={paraBold}>Date Ended:</Text>
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
