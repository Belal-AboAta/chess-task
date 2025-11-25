import type { Server, Socket } from "socket.io";

import {
  addPlayer,
  createGameRoom,
  getRoom,
  removePlayer,
} from "./gameRoomManagement";
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
  socket.on("create-room", () => {
    if (socket.data.roomId) {
      socket.emit("error", { message: "You are already in a room." });
      return;
    }
    const room = createGameRoom();
    const playerColor = addPlayer(room.id, socket.id);

    if (!playerColor) {
      socket.emit("error", { message: "Failed to add player to the room." });
      return;
    }

    socket.data.roomId = room.id;
    socket.data.playerColor = playerColor;

    socket.join(room.id);

    socket.emit("room-created", {
      roomId: room.id,
      playerColor,
    });

    console.log(`Room ${room.id} created by ${socket.id} (${playerColor})`);
  });

  socket.on("join-room", (data) => {
    if (socket.data.roomId) {
      socket.emit("error", { message: "You are already in a room." });
      return;
    }
    const { roomId } = data;
    const room = getRoom(roomId);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    if (room.players.size >= 2) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    const playerColor = addPlayer(roomId, socket.id);

    if (!playerColor) {
      socket.emit("error", { message: "Failed to add player to the room." });
      return;
    }

    socket.data.roomId = roomId;
    socket.data.playerColor = playerColor;

    socket.join(roomId);

    io.to(roomId).emit("opponent-joined");

    console.log(`Player ${socket.id} (${playerColor}) joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    const { roomId } = socket.data;

    if (roomId) {
      removePlayer(roomId, socket.id);
      console.log(`Player ${socket.id} disconnected from room ${roomId}`);
    }

    console.log(`Client disconnected: ${socket.id}`);
  });
  console.log("Socket io", io);
}
