"use client";
import { styled, useTheme } from "styled-components";
import RequestBookingCard from "./request-booking-components/RequestBookingCard";
import RequestBookingBar from "./request-booking-components/RequestBookingBar";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { useUserId } from "@/hooks/client-side/useUserId";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthForm from "@/components/auth-page/AuthForm";
import EmptyState from "@/components/empty-state/EmptyState";
import Modal from "react-modal";
import { v4 as uuid } from "uuid";

export default function BookingColumn() {
   const [dayCount, setDayCount] = useState();
   const [bookingPriceTotal, setBookingPriceTotal] = useState();
   const [processingTotal, setProcessingTotal] = useState(30);
   const [totalBeforeTaxes, setTotalBeforeTaxes] = useState();
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [existingCustomer, setExistingCustomer] = useState(false);
   const [customerId, setCustomerId] = useState();
   const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
   const [hostConnectAccountId, setHostConnectAccountId] = useState();
   const [guestCustomerId, setGuestCustomerId] = useState();
   const [hostCustomerId, setHostCustomerId] = useState();
   const [modalIsOpen, setIsOpen] = useState(false);
   const router = useRouter();
   const params = useParams();
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const guestCompanyId = useCompanyId(supabase);
   const [isDesktop, setIsDesktop] = useState();
   const theme = useTheme();

   useEffect(() => {
      const updateMedia = () => {
         setIsDesktop(window.innerWidth > parseInt(theme.breakPoint.tablet));
      };
      window.addEventListener("resize", updateMedia);
      updateMedia();
      return () => window.removeEventListener("resize", updateMedia);
   }, [theme.breakPoint.tablet]);

   // setting nook const to redux state of the nook slice.
   const nook = useSelector((state) => state.viewNook.nook);

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

   // fetch host stripe connect ID and guest's & host's stripe customer IDs.
   useEffect(() => {
      if (nook.user_id) {
         const fetchHostConnectId = async () => {
            const { data, error } = await supabase
               .from("stripe_connect")
               .select("connect_account_id")
               .eq("user_id", nook.user_id);
            if (error) {
               console.log("error getting connect account id", error);
            } else {
               setHostConnectAccountId(data[0]?.connect_account_id);
            }
         };
         fetchHostConnectId();
         const fetchHostCustomerId = async () => {
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", nook?.user_id);
            if (error) {
               console.log(`error getting host's customer ID`, error);
            } else {
               console.log("host customer id", data);
               setHostCustomerId(data[0]?.customer_id);
            }
         };
         fetchHostCustomerId();
      }

      if (userId) {
         const fetchGuestCoustomerId = async () => {
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", userId);
            if (error) {
               console.log(`error getting guest's customer ID`, error);
            } else {
               setGuestCustomerId(data[0]?.customer_id);
            }
         };
         fetchGuestCoustomerId();
      }
   }, [nook.user_id, supabase, userId]);

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

   let endDateSelect;
   // date selection handler
   const dateFormat = "MM/DD/YYYY";
   const handleDateSelect = (dates) => {
      const days =
         dates[1]?.$D - dates[0]?.$D === 0
            ? 1
            : dates[1]?.$D - dates[0]?.$D + 1;
      const price = nook.price_type === "dailyRate" ? nook.price * days : null;
      const startDateSelect = `${dates[0]?.$M + 1}/${dates[0]?.$D}/${
         dates[0]?.$y
      }`;
      if (dates[1]) {
         endDateSelect = `${dates[1]?.$M + 1}/${dates[1]?.$D}/${dates[1]?.$y}`;
      }
      setValue("dates", `${startDateSelect} - ${endDateSelect}`, {
         shouldValidate: true,
      });
      setDayCount(days);
      let newProcessingTotal;
      newProcessingTotal =
         nook.price_type === "dailyRate"
            ? days >= 30
               ? price * 0.2
               : days >= 7
               ? price * 0.15
               : price * 0.12
            : days >= 30
            ? days * 15
            : days >= 7
            ? days * 25
            : days * 30;
      setProcessingTotal(newProcessingTotal);
      setBookingPriceTotal(price ? price * days : newProcessingTotal);
      setTotalBeforeTaxes(
         price ? price * days + newProcessingTotal : newProcessingTotal
      );
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
      const hostCompanyId = nook.company_id;
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
               host_customer_id: hostCustomerId,
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
            console.log("Error inserting draft request", error);
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
         top: "0",
         right: "0",
         left: "0",
         bottom: "0",
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
                     buttonHref="/account/payments-payouts/payments"
                  />
               )
            )}
         </Modal>
         <Wrapper>
            {isDesktop ? (
               <RequestBookingCard
                  nook={nook}
                  onChange={handleDateSelect}
                  format={dateFormat}
                  disabledDate={disabledDates}
                  name={name}
                  totalBeforeTaxes={totalBeforeTaxes}
                  bookingPriceTotal={bookingPriceTotal}
                  processingTotal={processingTotal}
                  dayCount={dayCount}
                  handleNewRequest={handleSubmit(handleNewRequest)}
                  userId={userId}
                  errors={errors}
                  ref={ref}
               />
            ) : (
               <RequestBookingBar
                  nook={nook}
                  onChange={handleDateSelect}
                  format={dateFormat}
                  disabledDate={disabledDates}
                  name={name}
                  totalBeforeTaxes={totalBeforeTaxes}
                  bookingPriceTotal={bookingPriceTotal}
                  dayCount={dayCount}
                  handleNewRequest={handleSubmit(handleNewRequest)}
                  startDate={startDate}
                  endDate={endDate}
                  errors={errors}
                  ref={ref}
               />
            )}
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   position: relative;
   height: 100%;
`;
