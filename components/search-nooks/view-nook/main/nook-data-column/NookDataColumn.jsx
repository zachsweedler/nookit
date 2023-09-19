'use client'
import { styled } from "styled-components"
import Location from "./location/Location"
import HostedBy from "./hosted-by/HostedBy"
import About from "./about/About"
import Amenities from "./amenities/Amenities"
import Map from "./map/Map"
import NookImages from "./nook-images/NookImages"

export default function NookDataColumn () {

    return (
        <Wrapper>
            <Location/>
            <HostedBy/>
            <About/>
            <NookImages/>
            <Amenities/>
            <Map/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 70px;
    width: 100%;
`