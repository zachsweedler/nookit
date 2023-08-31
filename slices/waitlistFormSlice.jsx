'use client'
import { createSlice } from '@reduxjs/toolkit';

const waitlistFormSlice = createSlice({
  name: 'waitlistForm',
  initialState: {
    step: 1
  },
  reducers: {
    updateSteps: (state, action) => {
        state.step = action.payload.value; // Update the step value
    },
    restartSteps: (state) => {
      state.step = 1
    }
  }
});

export const { updateSteps, restartSteps } = waitlistFormSlice.actions;

export default waitlistFormSlice.reducer;



