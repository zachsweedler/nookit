'use client'
import { styled } from "styled-components"
import Location from "./location/Location"
import HostedBy from "./hosted-by/HostedBy"
import About from "./about/About"
import Amenities from "./amenities/Amenities"
import Map from "./map/Map"
import NookImages from "./nook-images/NookImages"
import { Divider } from "@/styles/mui/Divider"

export default function NookDataColumn () {

    return (
        <Wrapper>
            <Location/>
            <Divider/>
            <HostedBy/>
            <Divider/>
            <About/>
            <Divider/>
            <NookImages/>
            <Divider/>
            <Amenities/>
            <Divider/>
            <Map/>
            
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 50px;
    width: 100%;
    padding-bottom: 50px;
`