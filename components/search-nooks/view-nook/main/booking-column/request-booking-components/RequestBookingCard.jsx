"use client";
import { H6, Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled } from "styled-components";
import { Button } from "@/styles/Buttons";
import { DateRangePicker } from "@/styles/antd/DateRangePicker";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Tooltip } from "@mui/material";
import MuiTooltip from "@/styles/mui/MuiTooltip";

export default function RequestBookingCard({
   nook,
   onChange,
   format,
   disabledDate,
   totalBeforeTaxes,
   bookingPriceTotal,
   dayCount,
   handleNewRequest,
   processingTotal,
   name,
   ref,
   errors,
}) {
   return (
      <>
         <Wrapper>
            <Price>
               <H6 $weight="semibold">
                  {nook?.price_type === "dailyRate"
                     ? `$${nook.price}`
                     : `${nook.price}%`}
               </H6>
               <Para size="textmd" $weight="medium">
                  {nook?.price_type === "dailyRate" ? `day` : `of sales`}
               </Para>
            </Price>
            <Divider />
            <Form onSubmit={handleNewRequest}>
               <DateRange>
                  <Para size="textmd" $weight="medium">
                     Dates
                  </Para>
                  <DateRangePicker
                     onChange={onChange}
                     type="primary"
                     format={format}
                     allowClear={false}
                     disabledDate={disabledDate}
                     name={name}
                     ref={ref}
                  />
                  {errors.dates && (
                     <Para size="textxs" $weight="regular" color="error">
                        {errors.dates.message}
                     </Para>
                  )}
               </DateRange>
               <RequestButton>
                  <Button type="submit" $brandcolor={true}>
                     Request Booking
                  </Button>
                  <Para
                     size="textsm"
                     $weight="medium"
                     color="primary.brand.b600"
                  >
                     You won&apos;t be charged yet
                  </Para>
               </RequestButton>
            </Form>
            {totalBeforeTaxes && (
               <Calculation>
                  {nook.price_type === "dailyRate" ? (
                     <LineItem>
                        <Para size="textmd" $weight="regular">
                           {formatCurrency(nook.price)} x {dayCount} days
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {formatCurrency(bookingPriceTotal)}
                        </Para>
                     </LineItem>
                  ) : (
                     <LineItem>
                        <Para size="textmd" $weight="regular">
                           Days
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {dayCount}
                        </Para>
                     </LineItem>
                  )}
                  <LineItem>
                     <div style={{display: 'flex', flexDirection: 'row', columnGap: '5px'}}>
                        <Para size="textmd" $weight="regular">
                           Processing
                        </Para>
                        <MuiTooltip text="This covers costs that allow Nookit to complete your transaction." />
                     </div>
                     <Para size="textmd" $weight="regular">
                        {formatCurrency(processingTotal)}
                     </Para>
                  </LineItem>
                  <Divider style={{ width: "100%" }} />
                  <LineItem>
                     <Para size="textmd" $weight="medium">
                        Total before taxes
                     </Para>
                     <Para size="textmd" $weight="medium">
                        {formatCurrency(totalBeforeTaxes)}
                     </Para>
                  </LineItem>
               </Calculation>
            )}
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 25px;
   position: sticky;
   top: 120px;
   height: auto;
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   padding: 30px;
   border-radius: 12px;
   width: 450px;
   margin-bottom: 100px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      width: 100%;
   }
`;

const Form = styled.form`
   display: flex;
   flex-direction: column;
   row-gap: 25px;
`;

const Price = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   width: 100%;
   align-items: end;
   justify-content: center;
`;

const DateRange = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   width: 100%;
   align-items: start;
`;

const RequestButton = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 9px;
   justify-content: center;
   align-items: center;
   width: 100%;
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
