'use client';
import { createSlice } from '@reduxjs/toolkit';

const viewNookSlice = createSlice({
    name: 'viewNook',
    initialState: {
        nook: []
    },
    reducers: {
      setViewNook: (state, action) => {
        state.nook = action.payload[0];
      },
    }
  });

export const { setViewNook } = viewNookSlice.actions;

export default viewNookSlice.reducer;
