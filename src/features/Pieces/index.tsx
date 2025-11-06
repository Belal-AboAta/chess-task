import React from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useMoves } from "@/hooks/useMoves";
import { usePosition } from "@/hooks/usePosition";

import { Piece } from "./components/Piece";

export const Pieces: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { currentPosition } = usePosition();

  const ref = React.useRef<HTMLDivElement>(null);

  const { move } = useMoves();
  const { onDrop, onDragOver } = useDragAndDrop();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!currentPosition) return;
    onDrop(e, () => move(e, currentPosition, ref));
  };
  return (
    <div
      {...props}
      className="absolute inset-0 w-full h-full"
      ref={ref}
      onDrop={handleDrop}
      onDragOver={onDragOver}
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
