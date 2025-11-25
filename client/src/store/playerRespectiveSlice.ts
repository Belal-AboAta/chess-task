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
    changeRespective: (state) => {
      state.respective = state.respective === "white" ? "black" : "white";
    },
  },
});

export const { changeRespective } = playerRespectiveSlice.actions;

export const selectRespective = (state: RootState) =>
  state.playerRespective.respective;

export default playerRespectiveSlice.reducer;
