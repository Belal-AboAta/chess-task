import React from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useMoves } from "@/hooks/useMoves";
import { usePosition } from "@/hooks/usePosition";
import { useSelectedTile } from "@/hooks/useSelectedTile";
import { getCoords } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectTileSize } from "@/store/tileSizeSlice";

import { Piece } from "./components/Piece";

export const Pieces: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { currentPosition } = usePosition();

  const ref = React.useRef<HTMLDivElement>(null);

  const { move } = useMoves();
  const { onDrop, onDragOver } = useDragAndDrop();
  const tileSize = useAppSelector(selectTileSize);
  const { changeSelectedTile } = useSelectedTile();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!currentPosition) return;
    onDrop(e, () => move(e, currentPosition, ref));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    onDragOver(e, () => {
      const { x, y } = getCoords(e, ref, tileSize);
      changeSelectedTile(y, x);
    });
  };
  return (
    <div
      {...props}
      className="absolute inset-0 w-full h-full"
      ref={ref}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {currentPosition &&
        currentPosition.map((row, rank) =>
          row.map((piece, file) => {
            if (!piece) return null;
            return (
              <Piece
                key={`${rank}-${file}`}
                piece={piece}
                rank={rank}
                file={file}
              />
            );
          }),
        )}
    </div>
  );
};
