'use client'
import Lottie from "lottie-react"
import loadingAnimation from "../../public/nookit-loading.json";

export default function Loading () {

    return (
        <Lottie animationData={loadingAnimation} loop={true} style={{width: '40px', height: '40px'}}/>
    )
}