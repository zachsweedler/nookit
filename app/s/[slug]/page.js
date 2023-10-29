import ViewNook from "@/components/search-nooks/view-nook/ViewNook";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
   const id = params.slug;
   const supabase = createServerComponentClient({ cookies });

   const { data } = await supabase
      .from("locations")
      .select("name, city, type, state_code, profiles(user_id)")
      .eq("id", id);
   console.log("location", data);
   
   if (data) {
      const { data: locationImage } = await supabase.storage
         .from("user-images")
         .list(`${data[0].profiles.user_id}/locations/${id}/location_images`);
      return {
         metadataBase: new URL(
            "https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/user-images/"
         ),
         title: `${data[0]?.name} | ${data[0]?.type} in ${data[0]?.city}, ${data[0]?.state_code}`,
         openGraph: {
            images: [`${data[0].profiles.user_id}/locations/${id}/${locationImage[1].name}`],
         },
      };
   }
}

export default async function Nook() {
   return (
      <>
         <ViewNook />
      </>
   );
}
