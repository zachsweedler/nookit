/* eslint-disable @next/next/no-img-element */
"use client";
import { usePathname } from "next/navigation";
import { styled } from "styled-components";
const { Para } = require("@/styles/Typography");

export default function ReviewBanner({ submitted }) {
    const pathname = usePathname();
    return (
        <>
            {submitted ? (
                pathname !== "/waitlist/dash" ? null : (
                    <ReviewBannerWrapper pathname={pathname}>
                        <img
                            alt="nook-image"
                            src="/check-icon-circle-white.svg"
                            width={25}
                            height={25}
                        />
                        <Para size="textlg" weight="regular" color="white">
                            You&apos;re on the waitlist!
                        </Para>
                    </ReviewBannerWrapper>
                )
            ) : null}
        </>
    );
}

const ReviewBannerWrapper = styled.div`
    display: flex;
    padding: 40px 20px;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    column-gap: 12px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    height: 50px;
    z-index: 300;
    position: static;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.color.primary.brand.b600};
`;
