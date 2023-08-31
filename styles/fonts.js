import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";

export const inter = Inter({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ['latin'],
    variable: '--inter-default'
})

export const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ['latin'],
    variable: '--inter-default'
})