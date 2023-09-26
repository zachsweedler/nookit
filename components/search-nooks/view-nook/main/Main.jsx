'use client'
import { styled } from "styled-components"
import NookDataColumn from "./nook-data-column/NookDataColumn"
import BookingColumn from "./booking-column/BookingColumn"

export default function Main () {

    return (
        <Grid>
            <NookDataColumn/>
            <BookingColumn/>
        </Grid>
    )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 90px;
  @media screen and (max-width: ${({theme}) => theme.breakPoint.tablet})  {
        grid-template-columns: 1fr;
  }
`