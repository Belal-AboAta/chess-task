import type { Server, Socket } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function socketEventsHandlers(
  io: TypedServer,
  socket: TypedSocket,
): void {
  console.log("A user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
}
