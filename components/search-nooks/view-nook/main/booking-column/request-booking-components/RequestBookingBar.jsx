"use client";
import { Button } from "@/styles/Buttons";
import { Para } from "@/styles/Typography";
import { DateRangePickerMobile } from "@/styles/antd/DateRangePickerMobile";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useState } from "react";
import styled from "styled-components";

export default function RequestBookingBar({
   nook,
   onChange,
   format,
   disabledDate,
   handleNewRequest,
   startDate,
   endDate,
   name,
   ref,
   errors,
}) {
   const [rangeVisible, setRangeVisible] = useState(false);

   return (
      <>
         <Wrapper>
            <Left>
               <Rate>
                  <Para size="textmd" $weight="medium">
                     {nook?.price_type === "dailyRate" ? `$${nook.price}` : `${nook.price}%`}
                  </Para>
                  <Para size="textsm" $weight="regular">
                     {nook?.price_type === "dailyRate" ? `per day` : `of sales`}
                  </Para>
               </Rate>
               {endDate && (
                  <Dates onClick={() => setRangeVisible(true)}>
                     <Para
                        size="textsm"
                        $weight="regular"
                        style={{
                           textDecoration: "underline",
                           pointer: "cursor",
                        }}
                     >
                        {startDate} -
                        {endDate}
                     </Para>
                  </Dates>
               )}
            </Left>
            <Form onSubmit={handleNewRequest}>
               <Button
                  $brandcolor={true}
                  type={endDate ? "submit" : "text"}
                  style={{ width: "auto" }}
                  onClick={() => setRangeVisible(true)}
               >
                  {endDate ? "Request Booking" : "Check Availability"}
               </Button>
               {rangeVisible && (
                  <>
                     <DateRangeWrapper>
                        <DateRangePickerMobile
                           onChange={onChange}
                           type="primary"
                           format={format}
                           allowClear={false}
                           disabledDate={disabledDate}
                           name={name}
                           ref={ref}
                           inputReadOnly={true}
                        />
                        {errors.dates && (
                           <Para size="textxs" $weight="regular" color="error">
                              {errors.dates.message}
                           </Para>
                        )}
                     </DateRangeWrapper>
                  </>
               )}
            </Form>
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   padding: 0px 30px;
   background-color: white;
   height: 91px;
   border: 1px solid #dddddd;
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100vw;
   z-index: 1000;
`;

const Dates = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 3px;
   &:hover {
      cursor: pointer;
   }
`;

const Left = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 0px;
`;

const DateRangeWrapper = styled.div`
   height: auto;
   width: 100%;
   padding: 30px;
   background-color: white;
   position: absolute;
   bottom: 0;
   left: 0;
   transform: translateY(-90px);
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   align-items: start;
   border-top: 1px solid #dddddd;
   overflow: hidden;
   box-shadow: 0px -14px 14px rgba(0, 0, 0, 0.099);
`;

const Form = styled.form`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   width: auto;
`;

const Rate = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 3px;
   align-items: center;
`;
