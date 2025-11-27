import { preformMove } from "@/lib/piecesMoves";
import { convertCoordsToAlgebraic, getCoords } from "@/lib/utils";
import { getSocket } from "@/socket/socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCandidateMoves,
  selectCandidateMoves,
  selectGameState,
  setGameState,
  setPromotionSquare,
} from "@/store/positionSlice";
import { selectTileSize } from "@/store/tileSizeSlice";

export const useMoves = () => {
  const tileSize = useAppSelector(selectTileSize);
  const validMoves = useAppSelector(selectCandidateMoves);
  const gameStat = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  const move = (
    e: React.DragEvent<HTMLDivElement>,
    currentPosition: string[][],
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!ref.current || !validMoves) return;
    const { x, y } = getCoords(e, ref, tileSize);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");
    const socket = getSocket();

    console.log("piece", piece);

    const isValidMove = validMoves.some(([r, f]) => r === y && f === x);
    if (!isValidMove) return;

    dispatch(clearCandidateMoves());

    const { promotionSquare } = preformMove({
      position: currentPosition,
      from: { rank: Number(rank), file: Number(file) },
      to: { rank: y, file: x },
    });

    if (gameStat === "ongoing" && promotionSquare) {
      dispatch(setGameState("promotion"));
      dispatch(setPromotionSquare(promotionSquare));
      return;
    }

    if (socket) {
      const fromSquare = convertCoordsToAlgebraic(+rank, +file);
      const toSquare = convertCoordsToAlgebraic(y, x);

      console.log("Emitting move to server:", {
        from: fromSquare,
        to: toSquare,
      });

      socket.emit("make-move", {
        from: fromSquare,
        to: toSquare,
      });
    }
  };

  return {
    move,
  };
};
