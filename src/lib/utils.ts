import type { PlayerRespctiveType } from "@/types/playerTypes";

export function getBoardCoordinatesFromIndex(
  index: number,
  playerRespective: PlayerRespctiveType,
) {
  const rank = Math.floor(index / 8);
  const file = index % 8;
  const respectiveModule = playerRespective === "white" ? 0 : 1;
  const isBlack = (rank + file) % 2 === respectiveModule;

  const isLastRank = rank === 7;
  const isLastFile = file === 7;

  return {
    rank,
    file,
    isBlack,
    isLastRank,
    isLastFile,
  };
}

export function getFileLabel(file: number): string {
  const fileLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return fileLabels[file - 1] || "";
}
