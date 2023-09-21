"use client";
import { H6, Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled, useTheme } from "styled-components";
import { useSelector } from "react-redux";
import { Button } from "@/styles/Buttons";
import { DateRangePicker } from "@/styles/antd/DateRangePicker";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/client-side/useUserId";
import dayjs from "dayjs";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthForm from "@/components/auth-page/AuthForm";
import EmptyState from "@/components/empty-state/EmptyState";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { formatCurrency } from "@/utils/currencyFormatter";

export default function RequestBookingCard({}) {
   const [dayCount, setDayCount] = useState();
   const [bookingPriceTotal, setBookingPriceTotal] = useState();
   const [processingTotal, setProcessingTotal] = useState(30);
   const [totalBeforeTaxes, setTotalBeforeTaxes] = useState();
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [existingCustomer, setExistingCustomer] = useState(false);
   const [customerId, setCustomerId] = useState();
   const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
   const [modalIsOpen, setIsOpen] = useState(false);
   const [hostConnectAccountId, setHostConnectAccountId] = useState();
   const [guestCustomerId, setGuestCustomerId] = useState();
   const router = useRouter();
   const params = useParams();
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const guestCompanyId = useCompanyId(supabase)

   const validationSchema = yup.object().shape({
      dates: yup.string().required("A start and end date is required"),
   });

   // form validation for the date range picker.
   const {
      formState: { errors },
      handleSubmit,
      setValue,
      register,
   } = useForm({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
   });

   // for date range picker props
   const { name, ref } = register("dates");

   // fetching data to check booking request eligibility for user
   useEffect(() => {
      if (userId) {
         const checkCustomerExists = async () => {
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", userId);
            if (error) {
               console.log("error getting customer Id", error);
            } else if (data && data.length > 0) {
               setExistingCustomer(true);
               setCustomerId(data[0].customer_id);
            } else {
               setExistingCustomer(false);
            }
         };
         if (existingCustomer && customerId) {
            const checkPaymentMethods = async () => {
               const response = await fetch(
                  `${window.location.origin}/api/list-customer-payment-methods`,
                  {
                     method: "GET",
                     headers: {
                        "Content-Type": "application/json",
                        "X-Customer-Id": customerId,
                     },
                  }
               );
               const res = await response.json();
               if (!res.success) {
                  setHasPaymentMethod(false);
               } else {
                  res.data.length > 0
                     ? setHasPaymentMethod(true)
                     : setHasPaymentMethod(false);
               }
            };
            checkPaymentMethods();
         }
         checkCustomerExists();
      }
   }, [existingCustomer, customerId, supabase, userId]);

   // setting nook const to redux state of the nook slice.
   const nook = useSelector((state) => state.viewNook.nook);

   // fetch host (connect ID) and guest's (customer ID) stripe IDs
   useEffect(()=> {
      if (nook.user_id) {
         const fetchHostConnectId = async () => {
            const { data, error } = await supabase.from('stripe_connect').select('connect_account_id').eq('user_id', nook.user_id)
            if (error) {
               console.log('error getting connect account id', error)
            } else {
               setHostConnectAccountId(data[0]?.connect_account_id);
            }
         }
         fetchHostConnectId();
      }
      
      if (userId) {
         const fetchGuestCoustomerId = async () => {
            const { data, error } = await supabase.from('stripe_customers').select('customer_id').eq('user_id', userId)
            if (error) {
               console.log('error', error)
            } else {
               setGuestCustomerId(data[0]?.customer_id);
            }
         }
         fetchGuestCoustomerId();
      }  
   },[nook.user_id, supabase, userId])


   let endDateSelect
   // date selection handler
   const dateFormat = "MM/DD/YYYY";
   const handleDateSelect = (dates) => {
      const days =
         dates[1]?.$D - dates[0]?.$D === 0
            ? 1
            : dates[1]?.$D - dates[0]?.$D + 1;
      const price = nook.daily_rate * days
      const startDateSelect = `${dates[0]?.$M + 1}/${dates[0]?.$D}/${dates[0]?.$y}`;
      if (dates[1]) {
         endDateSelect = `${dates[1]?.$M + 1}/${dates[1]?.$D}/${dates[1]?.$y}`;
      }
      setValue("dates", `${startDateSelect} - ${endDateSelect}`, { shouldValidate: true });
      setDayCount(days);
      setBookingPriceTotal(price);
      let newProcessingTotal;
      if (days >= 30) {
         newProcessingTotal = price * 0.20
      } else if (days >= 7) {
         newProcessingTotal = price * 0.15
      } else {
         newProcessingTotal = price * 0.12
      }
      setProcessingTotal(newProcessingTotal);
      setTotalBeforeTaxes(newProcessingTotal + price);
      setStartDate(startDateSelect);
      setEndDate(endDateSelect);
   };

   // this is what calculates which dates to disable for the antd date range picker.
   const getBookedDatesList = (bookedDates) => {
      let bookedDatesList = [];
      bookedDates?.forEach((range) => {
         let startDate = dayjs(range.start_date);
         const endDate = dayjs(range.end_date);
         while (startDate <= endDate) {
            bookedDatesList.push(startDate.format("MM/DD/YYYY"));
            startDate = startDate.add(1, "day");
         }
      });
      return bookedDatesList;
   };
   const bookedDates = getBookedDatesList(nook.booked_dates);

   // Modify the disabledDate function
   const disabledDates = (current) => {
      const isBeforeToday = current < dayjs().endOf("day");
      const formattedCurrentDate = current.format("MM/DD/YYYY");
      const isBooked = bookedDates.includes(formattedCurrentDate);
      return isBeforeToday || isBooked;
   };

   // submit handler
   const handleNewRequest = async () => {
      if (!userId || !existingCustomer || !hasPaymentMethod) {
         console.log("Account is not eligible for requesting a booking yet.");
         setIsOpen(true);
         return;
      }
      const hostId = nook.user_id;
      const hostCompanyId = nook.company_id
      if (hostId) {
         const { data, error } = await supabase
            .from("bookings")
            .insert({
               id: uuid(),
               status: "draft", // status flow: 1) draft --> 2) pending ---> 3) accepted/declined
               nook_id: params.slug, // if an attacker trying IDOR, they will be redirected to a new page with null field states.
               guest_user_id: userId,
               host_user_id: hostId,
               guest_company_id: guestCompanyId,
               host_company_id: hostCompanyId,
               guest_customer_id: guestCustomerId,
               host_connect_account_id: hostConnectAccountId,
               start_date: startDate,
               end_date: endDate,
               days_count: dayCount,
               booking_price: bookingPriceTotal,
               booking_price_total_before_taxes: totalBeforeTaxes,
               processing_fee: processingTotal,
            })
            .select();
         if (error) {
            console.log("request error", error);
         } else {
            router.push(
               `/s/${params.slug}/request-booking?id=${data[0].id}&locationImage=${nook.location_images[0]}`
            );
         }
      }
   };

   function closeModal() {
      setIsOpen(false);
   }

   const customModalStyles = {
      overlay: {
         backgroundColor: "#0000009e",
         zIndex: 9999, // Set a higher z-index value here
         top: '0',
         right: '0',
         left:'0',
         bottom:'0'
      },
      content: {
         top: "50%",
         left: "50%",
         right: "auto",
         bottom: "auto",
         marginRight: "-50%",
         transform: "translate(-50%, -50%)",
         zindex: "9999",
         border: "none",
         backgroundColor: "white",
         padding: "50px 20px",
      },
   };

   return (
      <>
         <Modal
            isOpen={modalIsOpen}
            style={customModalStyles}
            onRequestClose={closeModal}
         >
            {!userId ? (
               <AuthForm />
            ) : (
               (!existingCustomer || !hasPaymentMethod) && (
                  <EmptyState 
                     title="No Payment Methods"
                     description="Please add a payment method before making a booking request."
                     button="Go to Payment Settings"
                     buttonHref="/account/payments-payouts"
                  />
               )
            )}
         </Modal>
         <Wrapper>
            <Price>
               <H6 $weight="semibold">${nook?.daily_rate}</H6>
               <Para size="textmd" $weight="semibold">
                  / day
               </Para>
            </Price>
            <Divider />
            <Form onSubmit={handleSubmit(handleNewRequest)}>
               <DateRange>
                  <Para size="textmd" $weight="medium">
                     Dates
                  </Para>
                  <DateRangePicker
                     onChange={handleDateSelect}
                     type="primary"
                     format={dateFormat}
                     allowClear={false}
                     disabledDate={disabledDates}
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
            {bookingPriceTotal && (
               <Calculation>
                  <LineItem>
                     <Para size="textmd" $weight="regular">
                        {formatCurrency(nook.daily_rate)} x {dayCount} days
                     </Para>
                     <Para size="textmd" $weight="regular">
                        {formatCurrency(bookingPriceTotal)}
                     </Para>
                  </LineItem>
                  <LineItem>
                     <Para size="textmd" $weight="regular">
                        Processing
                     </Para>
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
   align-items: center;
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
