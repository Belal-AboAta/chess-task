import type { PieceProps } from "@/features/Pieces/components/Piece";
import { getValidMoves } from "@/lib/piecesMoves";
import {
  extractLastPosition,
  extractPositionAtLastIndex,
  isPlayerTurn,
} from "@/lib/utils";
import { selectIsMyTurn } from "@/store/gameSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCandidateMoves,
  clearSelectedTile,
  selectCastlingDirection,
  selectGameState,
  selectPositions,
  selectTurn,
  setCandidateMoves,
} from "@/store/positionSlice";

export const useDragAndDrop = () => {
  const turn = useAppSelector(selectTurn);
  const positions = useAppSelector(selectPositions);
  const gameStat = useAppSelector(selectGameState);
  const castlingDirection = useAppSelector(selectCastlingDirection);
  const isMyTurn = useAppSelector(selectIsMyTurn);

  const dispatch = useAppDispatch();

  const onDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    { piece, rank, file }: PieceProps,
  ) => {
    const isPieceTurn = isPlayerTurn(turn, piece);
    if (!isPieceTurn || !isMyTurn) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    setTimeout(() => {
      const element = e.target as HTMLImageElement;
      element.style.display = "none";
    }, 0);

    const currentPosition = extractLastPosition(positions);
    const prevPosition =
      extractPositionAtLastIndex(positions, 2) || currentPosition;

    if (!currentPosition) return;

    const currentCastlingDirection =
      castlingDirection?.[castlingDirection.length - 1];

    if (gameStat === "ongoing") {
      const validMoves = getValidMoves({
        position: currentPosition,
        piece,
        rank: rank.toString(),
        file: file.toString(),
        prevPosition: prevPosition,
        castlingDirection: currentCastlingDirection,
      });

      dispatch(setCandidateMoves(validMoves));
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, onDropCB: () => void) => {
    e.preventDefault();
    onDropCB();
  };

  const onDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    const element = e.target as HTMLImageElement;

    element.style.display = "block";
    dispatch(clearCandidateMoves());
    dispatch(clearSelectedTile());
  };

  const onDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    onDragOverCB: () => void,
  ) => {
    onDragOverCB();
    e.preventDefault();
  };

  return {
    onDragStart,
    onDrop,
    onDragOver,
    onDragEnd,
  };
};
