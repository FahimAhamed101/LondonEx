import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "@/features/auth/auth.slice";
import { baseApi } from "@/lib/api/base-api";

const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
