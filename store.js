"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import companyLogoReducer from "./slices/companyLogoSlice"
import nookFormReducer from "./slices/nookFormSlice";
import viewNookReducer from "./slices/viewNookSlice";
import bookingRequestReducer from "./slices/bookingRequestSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  debug: true
};

const rootReducer = combineReducers({
   nookForm: nookFormReducer,
   companyLogo: companyLogoReducer,
   viewNook: viewNookReducer,
   bookingRequest: bookingRequestReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
