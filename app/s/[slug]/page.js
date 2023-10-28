import ViewNook from "@/components/search-nooks/view-nook/ViewNook";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
   const id = params.slug;
   const supabase = createServerComponentClient({ cookies });
   const { data } = await supabase
      .from("locations")
      .select(
         "name, city, type, state_code, images"
      )
      .eq("id", id);
 
   return {
      metadataBase: new URL('https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/user-images/'),
      title: `${data[0]?.name} | ${data[0]?.type} in ${data[0]?.city}, ${data[0]?.state_code}`,
      openGraph: {
        images: [`${data[0].images[0]}`],
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
