'use client';
import { createSlice } from '@reduxjs/toolkit';

const nookFormSlice = createSlice({
  name: 'nookForm',
  initialState: {
    formValues: {
      id: "",
      about: "",
      images: [],
      blocked_dates: [],
      daily_rate: "",
      location_name: "",
      location_type: "",
      location_max_capacity: "",
      location_full_address: "",
      location_images: [],
      location_amenities: [],
    }
  },
  reducers: {
    setFormValues: (state, action) => {
      state.formValues = { ...state.formValues, ...action.payload };
    },
    setNookId: (state, action) => {
      state.formValues.id = action.payload;
    },
    restartForm: (state) => {
      state.formValues.id = null;
      state.formValues.about = "";
      state.formValues.images = [];
      state.formValues.blocked_dates = [];
      state.formValues.daily_rate = "";
      state.formValues.location_name = "";
      state.formValues.location_type = "";
      state.formValues.location_max_capacity = "";
      state.formValues.location_images = [];
      state.formValues.location_amenities = [];
      state.formValues.location_full_address = "";
    }
  }
});

export const { restartForm, setFormValues, setNookId } = nookFormSlice.actions;

export default nookFormSlice.reducer;
