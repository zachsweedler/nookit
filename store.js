"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import waitlistFormReducer from "./slices/waitlistFormSlice";
import uploadNookReducer from "./slices/uploadNookSlice"
import companyLogoReducer from "./slices/companyLogoSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  debug: true
};

const rootReducer = combineReducers({
   waitlistForm: waitlistFormReducer,
   uploadNook: uploadNookReducer,
   companyLogo: companyLogoReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

