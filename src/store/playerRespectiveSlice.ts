import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { PlayerRespctiveType } from "@/types/playerTypes";
import type { RootState } from "./";

export interface playerRespectiveState {
  respective: PlayerRespctiveType;
}

const initialState: playerRespectiveState = {
  respective: "white",
};

export const playerRespectiveSlice = createSlice({
  name: "playerRespective",
  initialState,
  reducers: {
    changeRespective: (state, action: PayloadAction<PlayerRespctiveType>) => {
      state.respective = action.payload;
    },
  },
});

export const { changeRespective } = playerRespectiveSlice.actions;

export const selectRespective = (state: RootState) =>
  state.playerRespective.respective;

export default playerRespectiveSlice.reducer;
