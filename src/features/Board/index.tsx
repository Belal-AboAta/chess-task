import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { useBoardSize } from "@/hooks/useBoardSize";
import { useTileSize } from "@/hooks/useTileSize";
import { getBoardCoordinatesFromIndex } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectRespective } from "@/store/playerRespectiveSlice";
import { changeTileSize } from "@/store/tileSizeSlice";
import { TileLabel } from "../components/TileLabel";

export const Board: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const dispatch = useAppDispatch();
  const respective = useAppSelector(selectRespective);
  const boardRef = useRef<HTMLDivElement>(null);
  const { width } = useBoardSize(boardRef);
  const { tileSize } = useTileSize(width);

  useEffect(() => {
    if (tileSize > 0) {
      dispatch(changeTileSize(tileSize));
    }
  }, [dispatch, tileSize]);
  return (
    <div
      className="w-full md:w-2/3 max-w-[800px] lg:rounded-lg aspect-square"
      {...props}
      ref={boardRef}
    >
      <div
        className="grid grid-cols-8 grid-rows-8 w-full h-full"
        style={{ gap: 0 }}
      >
        {Array.from({ length: 64 }).map((_, index) => {
          const { rank, file, isBlack, isLastRank, isLastFile } =
            getBoardCoordinatesFromIndex(index, respective);

          return (
            <div
              key={index}
              className={clsx(
                isBlack ? "bg-black-tile" : "bg-white-tile",
                "relative select-none",
              )}
              style={{ width: tileSize, height: tileSize }}
            >
              {isLastRank && (
                <TileLabel
                  tileType="file"
                  isBlack={isBlack}
                  respective={respective}
                  index={file}
                />
              )}
              {isLastFile && (
                <TileLabel
                  tileType="rank"
                  isBlack={isBlack}
                  respective={respective}
                  index={rank}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
