import { Para } from "@/styles/Typography";
import Link from "next/link";
import React from "react";
import { useTheme } from "styled-components";

function Agreement() {
   const theme = useTheme();

   return (
      <Para
         size="textxs"
         $weight="regular"
         color="primary.grey.g500"
         style={{ display: "inline" }}
      >
         By hitting &quot;Sign Up&quot; you agree to the Nookit&apos;s
         <Link
            href="/privacy"
            style={{
               fontSize: "inherit",
               fontWeight: theme.fontWeight.textxs.medium,
               color: theme.color.black,
            }}
         >
            {" " + "privacy policy" + " "}
         </Link>
         and
         <Link
            href="/terms"
            style={{
               fontSize: "inherit",
               fontWeight: theme.fontWeight.textxs.medium,
               color: theme.color.black,
            }}
         >
            {" " + "terms of service" + " "}
         </Link>
      </Para>
   );
}

export default Agreement;
