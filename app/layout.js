import NavPublic from "@/components/nav-public/NavPublic";
import { ReduxProvider } from "@/provider";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ThemeWrapper } from "@/styles/Theme";
import { poppins } from "@/styles/fonts";

export const metadata = {
   title: "Nookit | Showcase Your Brand Within a Store",
};

export default function RootLayout({ children }) {
   return (
      <>
         <meta property="og:image" content="/og-image.jpg" />
         <meta property="og:type" content="website" />
         <meta property="og:image:width" content="/og-image.jpg" />
         <meta property="og:image:height" content="/og-image.jpg" />
         <meta name='title' property="og:title" content="Nookit | Showcase Your Brand Within a Store" />
         <meta name='description' property="og:description" content="A website where brands can book a nook within another brand's storefront." />
         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
         <html lang="en">
            <ThemeWrapper>
               <GlobalStyles />
               <body className={poppins.className}>
                  <ReduxProvider>
                     <NavPublic />
                     {children}
                  </ReduxProvider>
               </body>
            </ThemeWrapper>
         </html>
      </>
   );
}
