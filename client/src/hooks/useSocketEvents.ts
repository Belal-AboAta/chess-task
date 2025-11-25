import { useEffect } from "react";

import { getSocket } from "@/socket/socket";
import {
  setError,
  setOpponentConnected,
  setPlayerColor,
  setRoomId,
} from "@/store/gameSlice";
import { useAppDispatch } from "@/store/hooks";
import type { ErrorData, RoomCreatedData } from "@/types/socketTypes";

export const useSocketEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn("Socket not available yet");
      return;
    }

    const handleConnectError = (error: Error) => {
      console.error("Connection error:", error);
      dispatch(setError("Failed to connect to server"));
    };

    const handleOpponentJoined = () => {
      console.log("Opponent joined");
      dispatch(setOpponentConnected(true));
    };

    const handleError = (data: ErrorData) => {
      console.error("Socket error:", data.message);
      dispatch(setError(data.message));
    };

    const handleRoomCreated = (data: RoomCreatedData) => {
      dispatch(setError(null));
      dispatch(setOpponentConnected(false));
      dispatch(setRoomId(data.roomId));
      dispatch(setPlayerColor(data.playerColor));
    };

    socket.on("room-created", handleRoomCreated);
    socket.on("connect_error", handleConnectError);
    socket.on("opponent-joined", handleOpponentJoined);
    socket.on("error", handleError);

    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("opponent-joined", handleOpponentJoined);
      socket.off("error", handleError);
    };
  }, [dispatch]);
};
