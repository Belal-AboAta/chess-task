import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./";

export interface tileSizeState {
  size: number;
}

const initialState: tileSizeState = {
  size: 0,
};

export const tileSizeSlice = createSlice({
  name: "tileSize",
  initialState,
  reducers: {
    changeTileSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const { changeTileSize } = tileSizeSlice.actions;

export const selectTileSize = (state: RootState) => state.tileSize.size;

export default tileSizeSlice.reducer;
