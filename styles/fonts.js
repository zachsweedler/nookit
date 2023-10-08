import { IBM_Plex_Sans, Inter, Poppins } from "next/font/google";

export const inter = Inter({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ['latin'],
    variable: '--font-inter'
})

export const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ['latin'],
    variable: '--font-poppins'
})

export const plex = IBM_Plex_Sans({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ['latin'],
    variable: '--font-poppins'
})