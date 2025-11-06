import { configureStore } from "@reduxjs/toolkit";

import playerRespectiveReducer from "./playerRespectiveSlice";
import tileSizeReducer from "./tileSizeSlice";

export const store = configureStore({
  reducer: {
    playerRespective: playerRespectiveReducer,
    tileSize: tileSizeReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
