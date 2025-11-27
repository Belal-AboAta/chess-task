import type { Chess, Move, Square } from "chess.js";

export interface ServerToClientEvents {
  "room-created": (data: roomCreatedData) => void;
  error: (data: ErrorData) => void;
  "opponent-joined": () => void;
  "move-made": (data: MoveMadeData) => void;
  "game-over": (data: GameOverData) => void;
  "joined-room": (data: joinRoomData) => void;
  "opponent-left": () => void;
}

export interface ClientToServerEvents {
  "make-move": (data: MakeMoveData) => void;
  "create-room": () => void;
  "join-room": (data: joinRoomData) => void;
  "leave-room": () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomId?: string;
  playerColor?: PlayerColor;
}

export interface GameRoom {
  id: string;
  chess: Chess;
  players: Map<PlayerColor, Player | null>;
  gameState?: "waiting" | "playing" | "ended";
  winner?: PlayerColor | "draw";
}

export type PlayerColor = "w" | "b";

export interface Player {
  id: string;
  color: PlayerColor;
}

export interface roomCreatedData {
  roomId: string;
  playerColor: PlayerColor;
}

export interface joinRoomData {
  roomId: string;
}

export interface ErrorData {
  message: string;
}

export interface MakeMoveData {
  from: Square;
  to: Square;
  promotion?: "q" | "r" | "b" | "n";
}

export interface MoveMadeData {
  move: Move;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
}

export interface GameOverData {
  result: "checkmate" | "draw";
  winner?: PlayerColor;
}

export interface joinRoomData {
  roomId: string;
  playerColor: PlayerColor;
}
