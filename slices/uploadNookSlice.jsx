'use client';
import { createSlice } from '@reduxjs/toolkit';

const uploadNookSlice = createSlice({
  name: 'uploadNook',
  initialState: {
    step: 1,
    uuid: null,
    formValues: {
      name: "",
      amenities: [],
      description: "",
      images: [],
      retail_space_type: "",
      retail_space_full_address: "",
      retail_space_images: [],
    }
  },
  reducers: {
    updateSteps: (state, action) => {
      state.step = action.payload.value; 
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    setNookId: (state, action) => {
      state.uuid = action.payload;
    },
    restartForm: (state) => {
      state.step = 1;
      state.uuid = null;
      state.formValues.name = "";
      state.formValues.amenities = [];
      state.formValues.description = "";
      state.formValues.images = [];
      state.formValues.retail_space_type = "";
      state.formValues.retail_space_full_address = "";
      state.formValues.retail_space_images = [];
    }
  }
});

export const { updateSteps, restartForm, setFormValues, setNookId } = uploadNookSlice.actions;

export default uploadNookSlice.reducer;
