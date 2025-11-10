import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createPosition } from "@/lib/utils";
import type { GameStateType } from "@/types/gameStateTypes";
import type { PlayerTurnType } from "@/types/playerTypes";

import type { RootState } from "./";

export interface positionState {
  positions: string[][][];
  candidateMoves?: number[][];
  gameState: GameStateType;
  selectedTile?: [number, number];
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
    setPositions: (state, action: PayloadAction<string[][][]>) => {
      state.positions = action.payload;
    },
    setPosition: (state, action: PayloadAction<string[][]>) => {
      state.positions.push(action.payload);
    },
    setCandidateMoves: (
      state,
      action: PayloadAction<positionState["candidateMoves"]>,
    ) => {
      state.candidateMoves = action.payload;
    },
    undomMove: (state) => {
      if (state.positions.length > 1 && state.gameState === "ongoing") {
        state.positions.pop();
        state.turn = state.turn === "wk" ? "bk" : "wk";
      }
    },
    setNewGame: (state) => {
      Object.assign(state, initialState);
    },
    clearCandidateMoves: (state) => {
      state.candidateMoves = undefined;
    },
    setSelectedTile: (
      state,
      action: PayloadAction<positionState["selectedTile"]>,
    ) => {
      state.selectedTile = action.payload;
    },
    clearSelectedTile: (state) => {
      state.selectedTile = undefined;
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

export const {
  setPositions,
  setPosition,
  setCandidateMoves,
  setNewGame,
  undomMove,
  clearCandidateMoves,
  setSelectedTile,
  clearSelectedTile,
  setGameState,
  changeTurn,
} = positionSlice.actions;

export const selectPositions = (state: RootState) => state.position.positions;
export const selectCandidateMoves = (state: RootState) =>
  state.position.candidateMoves;
export const selectGameState = (state: RootState) => state.position.gameState;
export const selectTurn = (state: RootState) => state.position.turn;
export const selectSelectedTile = (state: RootState) =>
  state.position.selectedTile;

export default positionSlice.reducer;
