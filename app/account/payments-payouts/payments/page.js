import PaymentsFormV2 from "@/components/account-page/payments-payouts/PaymentsFormV2";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Nookit | Payment Methods",
 };

export default async function BookingsHost() {
    return (
        <>
         <PaymentsFormV2/>
        </>
    )
}


