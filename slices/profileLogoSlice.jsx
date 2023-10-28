'use client'
import { createSlice } from '@reduxjs/toolkit';

const profileLogoSlice = createSlice({
  name: 'profileLogo',
  initialState: {
    path: null
  },
  reducers: {
    updateLogo: (state, action) => {
        state.path = action.payload; 
    },
  }
});

export const { updateLogo } = profileLogoSlice.actions;

export default profileLogoSlice.reducer;
