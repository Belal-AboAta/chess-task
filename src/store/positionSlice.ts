import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createPosition } from "@/lib/utils";
import type { GameStateType } from "@/types/gameStateTypes";
import type { PlayerTurnType } from "@/types/playerTypes";

import type { RootState } from "./";

export interface positionState {
  positions: string[][][];
  candidateMoves?: number[][];
  gameState: GameStateType;
  turn: PlayerTurnType;
}

const initialState: positionState = {
  positions: [createPosition()],
  candidateMoves: undefined,
  gameState: "ongoing",
  turn: "wk",
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<string[][]>) => {
      state.positions.push(action.payload);
    },
    setCandidateMoves: (
      state,
      action: PayloadAction<positionState["candidateMoves"]>,
    ) => {
      state.candidateMoves = action.payload;
    },
    setGameState: (
      state,
      action: PayloadAction<positionState["gameState"]>,
    ) => {
      state.gameState = action.payload;
    },
    changeTurn: (state) => {
      state.turn = state.turn === "wk" ? "bk" : "wk";
    },
  },
});

export const { setPosition, setCandidateMoves, setGameState, changeTurn } =
  positionSlice.actions;

export const selectPositions = (state: RootState) => state.position.positions;
export const selectCandidateMoves = (state: RootState) =>
  state.position.candidateMoves;
export const selectGameState = (state: RootState) => state.position.gameState;
export const selectTurn = (state: RootState) => state.position.turn;

export default positionSlice.reducer;
