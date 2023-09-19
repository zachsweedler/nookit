'use client'
import { styled } from "styled-components"
import RequestBookingCard from "./request-booking-card/RequestBookingCard"

export default function BookingColumn () {

    return (
        <Wrapper>
            <RequestBookingCard/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
`