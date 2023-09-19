"use client";
import { createSlice } from "@reduxjs/toolkit";

const bookingRequestSlice = createSlice({
   name: "bookingRequest",
   initialState: {
     data: null
   },
   reducers: {
      setBookingRequest: (state, action) => {
         state.data = { ...state.data, ...action.payload };
      },
      clearBookingRequest: (state) => {
         state.data = null;
      },
   },
});

export const { setBookingRequest, clearBookingRequest } = bookingRequestSlice.actions;
export default bookingRequestSlice.reducer;
