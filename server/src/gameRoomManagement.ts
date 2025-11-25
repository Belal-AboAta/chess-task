import { Chess } from "chess.js";
import { customAlphabet } from "nanoid";

import { GAME_ROOM_ID_LENGTH, NANOID_CHARS } from "./constants";
import { GameRoom, Player, PlayerColor } from "./types";

export const rooms: Map<string, GameRoom> = new Map();

export function generateRoomId(): string {
  const nanoid = customAlphabet(NANOID_CHARS, GAME_ROOM_ID_LENGTH);
  const id = nanoid();
  return rooms.has(id) ? generateRoomId() : id;
}

export function createGameRoom(): GameRoom {
  const id = generateRoomId();
  const chess = new Chess();
  const newRoom: GameRoom = {
    id,
    chess,
    players: new Map(),
  };
  rooms.set(id, newRoom);
  console.log(`Room created with id: ${id}`);
  return newRoom;
}

export function getRoom(roomId: string): GameRoom | undefined {
  return rooms.get(roomId);
}

export function addPlayer(
  roomId: string,
  playerId: string,
): PlayerColor | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  if (room.players.size >= 2) return null;

  const color: PlayerColor = room.players.size === 0 ? "w" : "b";

  const player: Player = {
    id: playerId,
    color,
  };

  room.players.set(color, player);

  if (room.players.size === 2) {
    room.gameState = "playing";
    console.log(`Game started in room: ${roomId}`);
  }

  return color;
}

export function removePlayer(roomId: string, playerId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const [color, player] of room.players.entries()) {
    if (player?.id === playerId) {
      room.players.delete(color);
      console.log(`Player ${playerId} removed from room ${roomId}`);
      break;
    }
  }

  if (room.players.size === 0) {
    rooms.delete(roomId);
    console.log(`Room deleted: ${roomId}`);
  }
}

export function getPlayerColor(
  roomId: string,
  playerId: string,
): PlayerColor | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  for (const [color, player] of room.players.entries()) {
    if (player?.id === playerId) {
      return color;
    }
  }
  return null;
}

export function getEnemey(
  roomId: string,
  playerColor: PlayerColor,
): Player | null | undefined {
  const room = rooms.get(roomId);
  if (!room) return null;

  const opponentColor: PlayerColor = playerColor === "w" ? "b" : "w";
  return room.players.get(opponentColor);
}

export function endGame(roomId: string, winner?: PlayerColor): void {
  const room = rooms.get(roomId);
  if (!room) return;

  room.gameState = "ended";
  room.winner = winner || "draw";
  console.log(`Game ended in room ${roomId}`);
}
