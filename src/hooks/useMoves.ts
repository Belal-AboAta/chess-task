import { preformMove } from "@/lib/piecesMoves";
import { getCoords } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeTurn,
  clearCandidateMoves,
  selectCandidateMoves,
  setPosition,
} from "@/store/positionSlice";
import { selectTileSize } from "@/store/tileSizeSlice";

export const useMoves = () => {
  const tileSize = useAppSelector(selectTileSize);
  const validMoves = useAppSelector(selectCandidateMoves);
  const dispatch = useAppDispatch();
  const move = (
    e: React.DragEvent<HTMLDivElement>,
    currentPosition: string[][],
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!ref.current || !validMoves) return;
    const { x, y } = getCoords(e, ref, tileSize);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");

    console.log("piece", piece);

    const isValidMove = validMoves.some(([r, f]) => r === y && f === x);
    if (!isValidMove) return;

    const newPosition = preformMove({
      position: currentPosition,
      from: { rank: Number(rank), file: Number(file) },
      to: { rank: y, file: x },
    });

    const moveSound = new Audio("/sounds/move.mp3");
    moveSound.play();

    // TODO: add sounds for capture, check, checkmate, castling, promotion

    dispatch(clearCandidateMoves());
    dispatch(changeTurn());

    dispatch(setPosition(newPosition));
  };

  return {
    move,
  };
};
