'use client'
import { createSlice } from '@reduxjs/toolkit';

const companyLogoSlice = createSlice({
  name: 'companyLogo',
  initialState: {
    path: null
  },
  reducers: {
    updateLogo: (state, action) => {
        state.path = action.payload; 
    },
  }
});

export const { updateLogo } = companyLogoSlice.actions;

export default companyLogoSlice.reducer;



