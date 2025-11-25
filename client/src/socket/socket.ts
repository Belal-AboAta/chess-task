import { io, Socket } from "socket.io-client";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socketTypes";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// NOTE: use singleton pattern to manage socket connection
class SocketManager {
  private socket: TypedSocket | null = null;

  connect(): TypedSocket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected manually");
    }
  }

  getSocket(): TypedSocket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketManager = new SocketManager();

export const getSocket = (): TypedSocket | null => socketManager.getSocket();
