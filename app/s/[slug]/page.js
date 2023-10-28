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
      title: `${data?.name} | ${data?.type} in ${data?.city}, ${data?.state_code}`,
      openGraph: {
        images: [`${data?.images[0]}`],
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
