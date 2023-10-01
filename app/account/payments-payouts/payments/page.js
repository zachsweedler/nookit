import PaymentsForm from "@/components/account-page/payments-payouts/PaymentsForm";
import PaymentsFormV2 from "@/components/account-page/payments-payouts/PaymentsFormV2";
export const dynamic = "force-dynamic";

export default async function BookingsHost() {
    return (
        <>
         <PaymentsFormV2/>
        </>
    )
}


