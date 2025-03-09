import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// Redux Persist Configuration
const persistConfig = {
  key: "auth",
  storage, // Stores in localStorage
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create Persistor
export const persistor = persistStore(store);

export default store;
