import type { Chess } from "chess.js";

export interface ServerToClientEvents {
  "room-created": (data: roomCreatedData) => void;
  error: (data: ErrorData) => void;
}

export interface ClientToServerEvents {
  "create-room": () => void;
  "join-room": (data: joinRoomData) => void;
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
