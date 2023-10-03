import PayoutsForm from "@/components/account-page/payments-payouts/PayoutsForm";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Nookit | Payouts",
 };


export default async function Payouts() {
    return (
        <>
         <PayoutsForm/>
        </>
    )
}


