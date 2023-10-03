import Booking from "@/components/bookings-page/view-booking/Booking";
export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Nookit | View Booking",
 };

 
export default async function ViewBooking () {

    return (
        <>
            <Booking/>
        </>
    )
}
