import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { PlayerColor } from "@/types/socketTypes";

import type { RootState } from "./";

export type GameMode = "waiting" | "playing" | "ended";

export interface GameState {
  mode: GameMode;
  roomId: string | null;
  playerColor: PlayerColor | null;
  opponentConnected: boolean;
  error: string | null;
}

const initialState: GameState = {
  mode: "waiting",
  roomId: null,
  playerColor: null,
  opponentConnected: false,
  error: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.mode = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string | null>) => {
      state.roomId = action.payload;
    },
    setPlayerColor: (state, action: PayloadAction<PlayerColor | null>) => {
      state.playerColor = action.payload;
    },
    setOpponentConnected: (state, action: PayloadAction<boolean>) => {
      state.opponentConnected = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetGame: () => initialState,
  },
});

export const {
  setGameMode,
  setRoomId,
  setPlayerColor,
  setOpponentConnected,
  setError,
  resetGame,
} = gameSlice.actions;

export const selectGameMode = (state: RootState) => state.game.mode;
export const selectRoomId = (state: RootState) => state.game.roomId;
export const selectPlayerColor = (state: RootState) => state.game.playerColor;
export const selectOpponentConnected = (state: RootState) =>
  state.game.opponentConnected;
export const selectError = (state: RootState) => state.game.error;

export const selectIsMyTurn = (state: RootState) => {
  const currentTurn = state.position.turn;
  const myColor = state.game.playerColor;
  if (!myColor) return false;
  const turnColor = currentTurn === "wk" ? "w" : "b";
  return turnColor === myColor;
};

export default gameSlice.reducer;
