import { CAPTURE_SOUND, GAME_END_SOUND, MOVE_SOUND } from "@/constants/sounds";
import {
  isCheckMate,
  isInsufficientMaterial,
  isStalematePosition,
  preformMove,
} from "@/lib/piecesMoves";
import { getCoords } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeTurn,
  clearCandidateMoves,
  selectCandidateMoves,
  selectGameState,
  setGameState,
  setPosition,
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

    console.log("piece", piece);

    const isValidMove = validMoves.some(([r, f]) => r === y && f === x);
    if (!isValidMove) return;

    const { newPosition, isCapture, promotionSquare } = preformMove({
      position: currentPosition,
      from: { rank: Number(rank), file: Number(file) },
      to: { rank: y, file: x },
    });

    // TODO: add sounds for capture, check, checkmate, castling, promotion

    dispatch(clearCandidateMoves());

    if (gameStat === "ongoing") {
      if (promotionSquare) {
        dispatch(setGameState("promotion"));
        dispatch(setPromotionSquare(promotionSquare));
      } else {
        dispatch(setPosition(newPosition));
        dispatch(changeTurn());
      }
      if (isCapture) {
        CAPTURE_SOUND.play();
      } else {
        MOVE_SOUND.play();
      }
    }

    const detectStalemate = isStalematePosition({
      positionAfterMove: newPosition,
      position: currentPosition,
      piece: piece,
    });

    const detectCheckMate = isCheckMate({
      positionAfterMove: newPosition,
      position: currentPosition,
      piece: piece,
    });

    if (detectCheckMate) {
      dispatch(setGameState("checkmate"));
      GAME_END_SOUND.play();
    }
    const detectInsufficientMaterial = isInsufficientMaterial(newPosition);

    if (detectStalemate || detectInsufficientMaterial) {
      dispatch(setGameState("draw"));
      GAME_END_SOUND.play();
    }
  };

  return {
    move,
  };
};
