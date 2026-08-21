import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";

// Your authSlice.js creates one reducer that handles everything auth related — login, logout, loading, errors.

const store = configureStore({ // configureStore = the construction company that builds the building.
  reducer: { // A reducer is just a function that knows how to change state.
    auth: authReducer,
  },
});

export default store;
