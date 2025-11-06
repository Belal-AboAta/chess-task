import { getCoords, getNewMove } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPosition } from "@/store/positionSlice";
import { selectTileSize } from "@/store/tileSizeSlice";

export const useMoves = () => {
  const tileSize = useAppSelector(selectTileSize);
  const dispatch = useAppDispatch();
  const move = (
    e: React.DragEvent<HTMLDivElement>,
    currentPosition: string[][],
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!ref.current) return;
    const { x, y } = getCoords(e, ref, tileSize);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");
    const newMove = getNewMove(
      currentPosition,
      piece,
      { rank: Number(rank), file: Number(file) },
      { rank: x, file: y },
    );

    dispatch(setPosition(newMove));
  };

  return {
    move,
  };
};
