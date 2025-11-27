export type PlayerColor = "w" | "b";

export interface ServerToClientEvents {
  "room-created": (data: RoomCreatedData) => void;
  error: (data: ErrorData) => void;
  "opponent-joined": () => void;
  "move-made": (data: MoveMadeData) => void;
  "joined-room": (data: joinRoomData) => void;
  "opponent-left": () => void;
}

export interface ClientToServerEvents {
  "create-room": () => void;
  "join-room": (data: JoinRoomData) => void;
  "make-move": (data: MakaeMoveData) => void;
  "leave-room": () => void;
}

export interface JoinRoomData {
  roomId: string;
}

export interface RoomCreatedData {
  roomId: string;
  playerColor: PlayerColor;
}

export interface ErrorData {
  message: string;
}

export type Square = string;

export interface Move {
  from: Square;
  to: Square;
  promotion?: "q" | "r" | "b" | "n";
  color: PlayerColor;
  captured?: string;
}

export interface MoveMadeData {
  move: Move;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
}

export interface MakaeMoveData {
  from: Square;
  to: Square;
  promotion?: string;
}

export interface joinRoomData {
  roomId: string;
  playerColor: PlayerColor;
}
