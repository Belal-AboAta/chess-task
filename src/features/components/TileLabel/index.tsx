import clsx from "clsx";
import React from "react";

import { getFileLabel } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectTileSize } from "@/store/tileSizeSlice";
import type { PlayerRespctiveType } from "@/types/playerTypes";
import type { TileType } from "@/types/tileTypes";

export interface TileLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  tileType: TileType;
  respective: PlayerRespctiveType;
  isBlack: boolean;
  index: number;
}
export const TileLabel: React.FC<TileLabelProps> = ({
  tileType,
  isBlack,
  respective,
  index,
}) => {
  const tileSize = useAppSelector(selectTileSize);
  const fileLabel = getFileLabel(
    respective === "white" ? index + 1 : 8 - index,
  );

  const labelFontSize = Math.floor(tileSize * 0.15) + "px";

  const rankLabel = respective === "white" ? 8 - index : index + 1;
  const label = tileType === "file" ? fileLabel : rankLabel;
  return (
    <span
      className={clsx(
        "absolute text-[min( select-none font-bold",
        isBlack ? "text-white-tile" : "text-black-tile",
        tileType === "file" ? "left-1 bottom-1" : "right-1 top-1",
      )}
      style={{ fontSize: labelFontSize }}
    >
      {label}
    </span>
  );
};
