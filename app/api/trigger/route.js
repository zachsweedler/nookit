
import { createAppRoute } from "@trigger.dev/nextjs";
import { client } from "@/trigger";
import "@/jobs/removeOldDraftBookings"
import "@/jobs/completedBooking"
import "@/jobs/bookingCompleted"
import "@/jobs/bookingCanceled"
import "@/jobs/bookingAccepted"
import "@/jobs/bookingDeclined"
import "@/jobs/bookingNew"

//this route is used to send and receive data with Trigger.dev
export const { POST, dynamic } = createAppRoute(client);
