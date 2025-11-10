import { createPortal } from "react-dom";

import { PROMOTION_PIECES } from "@/constants/pieces";
import { extractLastPosition, getPieceImagePath } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeTurn,
  clearPromotionSquare,
  selectGameState,
  selectPositions,
  selectPromotionSquare,
  selectTurn,
  setGameState,
  setPosition,
} from "@/store/positionSlice";
import { selectTileSize } from "@/store/tileSizeSlice";

export const PromotionBox = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(selectGameState);
  const turn = useAppSelector(selectTurn);
  const tileSize = useAppSelector(selectTileSize);
  const positions = useAppSelector(selectPositions);
  const promotionSquare = useAppSelector(selectPromotionSquare);

  const currentPosition = extractLastPosition(positions)?.map((row) => [
    ...row,
  ]);

  if (gameState !== "promotion") {
    return null;
  }
  const promotionOptoin = PROMOTION_PIECES[turn];
  const handleClick = (piece: string) => {
    if (currentPosition) {
      currentPosition[promotionSquare!.from.rank][promotionSquare!.from.file] =
        "";
      currentPosition[promotionSquare!.to.rank][promotionSquare!.to.file] =
        piece;
    }

    dispatch(setPosition(currentPosition!));
    dispatch(clearPromotionSquare());
    dispatch(changeTurn());
    dispatch(setGameState("ongoing"));
  };
  document.body.style.overflow = "hidden";
  return createPortal(
    <div className="min-h-screen min-w-full absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="rounded-lg bg-white flex items-center justify-center p-2 gap-2">
        {promotionOptoin.map((piece) => (
          <button
            key={piece}
            className="bg-white border border-gray-600 p-1 md:p-4 flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer hover:bg-gray-200 shadow-lg"
            onClick={() => handleClick(piece)}
          >
            <img
              src={getPieceImagePath(piece)}
              alt={piece}
              className="aspect-square"
              style={{ width: tileSize }}
            />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
};
