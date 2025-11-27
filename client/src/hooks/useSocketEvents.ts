import { useEffect } from "react";

import { CAPTURE_SOUND, GAME_END_SOUND, MOVE_SOUND } from "@/constants/sounds";
import { preformMove, updateCastleDirection } from "@/lib/piecesMoves";
import { convertAlgebraicToCoords, extractLastPosition } from "@/lib/utils";
import { getSocket } from "@/socket/socket";
import {
  setError,
  setOpponentConnected,
  setPlayerColor,
  setRoomId,
} from "@/store/gameSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeTurn,
  selectCastlingDirection,
  selectPositions,
  setCastlingDirection,
  setGameState,
  setPosition,
} from "@/store/positionSlice";
import type {
  ErrorData,
  joinRoomData,
  MoveMadeData,
  RoomCreatedData,
} from "@/types/socketTypes";

export const useSocketEvents = () => {
  const dispatch = useAppDispatch();
  const positions = useAppSelector(selectPositions);
  const castlingDirection = useAppSelector(selectCastlingDirection);

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

    const handleMoveMade = (data: MoveMadeData) => {
      console.log("Move made from server:", data);

      const { rank: fromRank, file: fromFile } = convertAlgebraicToCoords(
        data.move.from,
      );
      const { rank: toRank, file: toFile } = convertAlgebraicToCoords(
        data.move.to,
      );

      const currentPosition = extractLastPosition(positions);
      if (!currentPosition) return;

      const piece = currentPosition[fromRank][fromFile];

      const { newPosition, isCapture } = preformMove({
        position: currentPosition,
        from: { rank: fromRank, file: fromFile },
        to: { rank: toRank, file: toFile },
      });

      const currentCastlingDirection =
        castlingDirection?.[castlingDirection.length - 1];
      const newCastlingDirection = updateCastleDirection({
        castlingDirection: currentCastlingDirection,
        piece,
        from: { rank: fromRank, file: fromFile },
      });

      if (data.move.promotion) {
        const promotionPiece = `${data.move.color}${data.move.promotion}`;
        newPosition[toRank][toFile] = promotionPiece;
      }

      dispatch(setPosition(newPosition));
      dispatch(setCastlingDirection(newCastlingDirection));
      dispatch(changeTurn());

      if (isCapture || data.move.captured) {
        CAPTURE_SOUND.play();
      } else {
        MOVE_SOUND.play();
      }

      if (data.isCheckmate) {
        dispatch(setGameState("checkmate"));
        GAME_END_SOUND.play();
        dispatch(changeTurn());
      } else if (data.isDraw) {
        dispatch(setGameState("draw"));
        GAME_END_SOUND.play();
      }
    };

    const hanldeJoinRomm = (data: joinRoomData) => {
      dispatch(setError(null));
      dispatch(setOpponentConnected(true));
      dispatch(setRoomId(data.roomId));
      dispatch(setPlayerColor(data.playerColor));
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
    socket.on("joined-room", hanldeJoinRomm);
    socket.on("move-made", handleMoveMade);
    socket.on("error", handleError);

    return () => {
      socket.off("room-created", handleRoomCreated);
      socket.off("connect_error", handleConnectError);
      socket.off("opponent-joined", handleOpponentJoined);
      socket.off("joined-room", hanldeJoinRomm);
      socket.off("move-made", handleMoveMade);
      socket.off("error", handleError);
    };
  }, [dispatch, positions, castlingDirection]);
};
