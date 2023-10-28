'use client';
import { createSlice } from '@reduxjs/toolkit';

const nookFormSlice = createSlice({
  name: 'nookForm',
  initialState: {
    formValues: {
      id: null,
      created_at: "",
      status: "unlisted",
      user_id: null,
      profile_id: null,
      blocked_dates: [],
      booked_dates: [],
      price: "",
      price_type: "dailyRate",
      about: "",
      location_name: "",
      location_type: "",
      location_max_capacity: "",
      location_amenities: [],
      location_full_address: "",
      location_address: "",
      location_state_code: "",
      location_city: "",
      location_zip: "",
      location_country: "",
      location_longitude: "",
      location_latitude: "",
      location_geo_point: "",
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
      state.formValues.created_at = "";
      state.formValues.status = "unlisted";
      state.formValues.user_id = null,
      state.formValues.profile_id = null,
      state.formValues.blocked_dates = [];
      state.formValues.booked_dates = [],
      state.formValues.price = "";
      state.formValues.price_type = "dailyRate";
      state.formValues.about = "",
      state.formValues.location_name = "";
      state.formValues.location_about = "";
      state.formValues.location_type = "";
      state.formValues.location_max_capacity = "";
      state.formValues.location_amenities = [];
      state.formValues.location_full_address = "";
      state.formValues.location_geo_point = "";
      state.formValues.location_address = "";
      state.formValues.location_state_code = "";
      state.formValues.location_city = "";
      state.formValues.location_zip = "";
      state.formValues.location_country = "";
      state.formValues.location_longitude = "";
      state.formValues.location_latitude = "";
    }
  }
});

export const { restartForm, setFormValues, setNookId } = nookFormSlice.actions;

export default nookFormSlice.reducer;
