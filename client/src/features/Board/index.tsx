import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { useBoardSize } from "@/hooks/useBoardSize";
import { useSelectedTile } from "@/hooks/useSelectedTile";
import { useTileSize } from "@/hooks/useTileSize";
import { getCheckTile, getTileClass } from "@/lib/piecesMoves";
import {
  extractLastPosition,
  extractPositionAtLastIndex,
  getBoardCoordinatesFromIndex,
} from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectRespective } from "@/store/playerRespectiveSlice";
import {
  selectCandidateMoves,
  selectPositions,
  selectTurn,
} from "@/store/positionSlice";
import { changeTileSize } from "@/store/tileSizeSlice";
import { TileLabel } from "../components/TileLabel";
import { Pieces } from "../Pieces";

export const Board: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const dispatch = useAppDispatch();
  const respective = useAppSelector(selectRespective);
  const turn = useAppSelector(selectTurn);
  const positions = useAppSelector(selectPositions);
  const candidateMoves = useAppSelector(selectCandidateMoves);
  const boardRef = useRef<HTMLDivElement>(null);
  const { width } = useBoardSize(boardRef);
  const { tileSize } = useTileSize(width);

  const { selectedTile } = useSelectedTile();

  const currentPosition = extractLastPosition(positions);
  const prevPosition =
    extractPositionAtLastIndex(positions, 2) || currentPosition;

  const kingCheckedTile = getCheckTile({
    positionAfterMove: currentPosition!,
    position: prevPosition!,
    piece: turn,
  });
  const getClass = (rank: number, file: number) =>
    getTileClass({
      candidateMoves: candidateMoves || [],
      position: currentPosition!,
      rank,
      file,
      kingCheckedTile,
      selectedTile,
    });
  useEffect(() => {
    if (tileSize > 0) {
      dispatch(changeTileSize(tileSize));
    }
  }, [dispatch, tileSize]);
  return (
    <div
      className="w-full lg:rounded-lg aspect-square relative"
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

          const tileClass = getClass(7 - rank, file);

          return (
            <div
              key={index}
              className={clsx(
                isBlack ? "bg-black-tile" : "bg-white-tile",
                "relative select-none",
                tileClass,
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
      <Pieces />
    </div>
  );
};
