import clsx from "clsx";
import React from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { getPieceImagePath, getPiecePosition } from "@/lib/utils";
import { selectPlayerColor } from "@/store/gameSlice";
import { useAppSelector } from "@/store/hooks";

export interface PieceProps {
  piece: string;
  rank: number;
  file: number;
}

export const Piece: React.FC<PieceProps> = ({ piece, rank, file }) => {
  const pieceImagePath = getPieceImagePath(piece);
  const piecePosition = getPiecePosition(rank, file);

  const playerTurn = useAppSelector(selectPlayerColor);

  const { onDragStart, onDragEnd } = useDragAndDrop();

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    onDragStart(e, { piece, rank, file });
  };

  return (
    <img
      key={`${rank}-${file}`}
      src={pieceImagePath}
      alt="chess-piece"
      className={clsx(
        "absolute w-[12.5%] h-[12.5%] transition-all duration-300 select-none cursor-pointer",
        playerTurn === "b" && "rotate-180",
      )}
      style={piecePosition}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    />
  );
};
