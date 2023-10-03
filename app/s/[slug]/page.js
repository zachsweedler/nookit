import ViewNook from "@/components/search-nooks/view-nook/ViewNook";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
   const id = params.slug;
   const supabase = createServerComponentClient({ cookies });
   const { data } = await supabase
      .from("nooks")
      .select(
         "location_name, location_city, location_type, location_state_code, location_images"
      )
      .eq("id", id);
 
   return {
      metadataBase: new URL('https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/user-images/'),
      title: `${data[0]?.location_name} | ${data[0]?.location_type} in ${data[0]?.location_city}, ${data[0]?.location_state_code}`,
      openGraph: {
        images: [`${data[0].location_images[0]}`],
      },
   };
}


export default async function Nook() {
   return (
      <>
         <ViewNook />
      </>
   );
}
