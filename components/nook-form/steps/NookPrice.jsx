import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import Input from "@/styles/Input";
import { setFormValues } from "@/slices/nookFormSlice";
import { Section } from "./Styles";
import { Para } from "@/styles/Typography";
import { ButtonTab } from "@/styles/Buttons";
import styled from "styled-components";
import PaymentsFormV2 from "@/components/account-page/payments-payouts/PaymentsFormV2";

export default function NookPrice({ id, priceType, hasPaymentMethod }) {
   const dispatch = useDispatch();
   const [activeIndex, setActiveIndex] = useState(
      priceType === "salesPercent" ? 1 : 0
   );
   const [selectedPriceType, setSelectedPriceType] = useState(priceType);

   const {
      formState: { errors },
      register,
      setValue,
      watch,
   } = useFormContext();

   const price = watch("price");

   useEffect(() => {
      dispatch(setFormValues({ price: price, price_type: selectedPriceType }));
      console.log("method", hasPaymentMethod);
   }, [price, errors, hasPaymentMethod, dispatch, selectedPriceType]);

   const tabs = [
      { title: "Daily Rate", type: "dailyRate" },
      { title: "Percent of Sales", type: "salesPercent" },
   ];

   return (
      <Section id={id}>
         <Wrapper>
            <Tabs>
               {tabs.map((tab, index) => {
                  const isActive = index === activeIndex;
                  return (
                     <ButtonTab
                        key={tab}
                        type="text"
                        onClick={() => {
                           setActiveIndex(index);
                           setSelectedPriceType(tab.type);
                           setValue("price_type", tab.type);
                        }}
                        $isActive={isActive}
                     >
                        {tab.title}
                     </ButtonTab>
                  );
               })}
            </Tabs>
            {activeIndex === 0 && (
               <>
                  <Input
                     fieldName="price"
                     label="Daily Booking Rate"
                     adornmentLeft={
                        <Para size="textmd" weight="regular">
                           $
                        </Para>
                     }
                     register={register}
                     errors={errors}
                     id={id}
                  />
               </>
            )}
            {activeIndex === 1 && (
               <>
                  <Input
                     fieldName="price"
                     label="Percent of Sales to Collect from Guest"
                     adornmentRight={
                        <Para size="textmd" $weight="regular">
                           %
                        </Para>
                     }
                     register={register}
                     errors={errors}
                     id={id}
                  />
                  {!hasPaymentMethod && (
                     <>
                     <PaymentWrapper>
                        <Para size="textmd" $weight="regular">
                           ⓘ This type of pricing requires that hosts have a payment method on file. Add one below:
                        </Para>
                        <PaymentsFormV2/>
                        {errors.existing_customer && (
                           <Para size="textxs" $weight="regular" color="error">
                              {errors.existing_customer.message}
                           </Para>
                        )}
                     </PaymentWrapper>
                     </>
                  )}
               </>
            )}
            <Input
               fieldName="price_type"
               register={register}
               errors={errors}
               id={id}
               hidden={true}
            />
         </Wrapper>
      </Section>
   );
}

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
`;

const PaymentWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;
