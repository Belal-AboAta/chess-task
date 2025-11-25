import { configureStore } from "@reduxjs/toolkit";

import gameReducer from "./gameSlice";
import playerRespectiveReducer from "./playerRespectiveSlice";
import positionReducer from "./positionSlice";
import tileSizeReducer from "./tileSizeSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    playerRespective: playerRespectiveReducer,
    position: positionReducer,
    tileSize: tileSizeReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
