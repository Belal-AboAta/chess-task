import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createPosition } from "@/lib/utils";
import type { RootState } from "./";

export interface positionState {
  positions: string[][][];
}

const initialState: positionState = {
  positions: [createPosition()],
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<string[][]>) => {
      state.positions.push(action.payload);
    },
  },
});

export const { setPosition } = positionSlice.actions;

export const selectPositions = (state: RootState) => state.position.positions;

export default positionSlice.reducer;
