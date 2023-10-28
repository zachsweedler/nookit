'use client';
import { createSlice } from '@reduxjs/toolkit';

const viewNookSlice = createSlice({
  name: 'viewNook',
  initialState: {
      nook: {},
      location_images: [],
      nook_images: []
  },
  reducers: {
      setViewNook: (state, action) => {
          state.nook = action.payload.nook;
          state.location_images = action.payload.location_images;
          state.nook_images = action.payload.nook_images;
      },
  }
});

export const { setViewNook } = viewNookSlice.actions;

export default viewNookSlice.reducer;
