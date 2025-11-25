export type PlayerColor = "w" | "b";

export interface ServerToClientEvents {
  "room-created": (data: RoomCreatedData) => void;
  error: (data: ErrorData) => void;
  "opponent-joined": () => void;
}

export interface ClientToServerEvents {
  "create-room": () => void;
  "join-room": (data: JoinRoomData) => void;
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
