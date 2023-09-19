import NavPublic from "@/components/nav-public/NavPublic";
import { ReduxProvider } from "@/provider";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ThemeWrapper } from "@/styles/Theme";
import { antdTheme } from "@/styles/antd/theme";
import { poppins } from "@/styles/fonts";
import { ConfigProvider } from "antd";

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
         <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"></meta>
         <html lang="en">
            <ThemeWrapper>
               <GlobalStyles />
               <ConfigProvider theme={antdTheme}>
               <body className={poppins.className}>
                  <ReduxProvider>
                     <NavPublic />
                     {children}
                  </ReduxProvider>
               </body>
               </ConfigProvider>
            </ThemeWrapper>
         </html>
      </>
   );
}
