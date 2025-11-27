import type { CSSProperties } from "react";

import {
  GAME_STATE_INFO,
  PIECE_NOTATIONS,
  PIECE_TYPE,
  PIECES,
} from "@/constants/pieces";
import type { GameStateType } from "@/types/gameStateTypes";
import type { PlayerRespctiveType, PlayerTurnType } from "@/types/playerTypes";

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

export function getPieceImagePath(piece: string): string {
  return new URL(`../assets/${piece}.png`, import.meta.url).href;
}

export function getGameStateInfo(
  gameState: GameStateType,
  turn: PlayerTurnType,
) {
  const gameInfo = GAME_STATE_INFO[gameState];
  if (!gameInfo) return { imagePath: "", label: "", description: "" };
  const imagePath = new URL(
    gameInfo.imagePath.replace("{{}}", turn),
    import.meta.url,
  ).href;
  const playerName = turn === "wk" ? "White" : "Black";
  const label = gameInfo.label.replace("{{}}", playerName);
  const description = gameInfo.description.replace("{{}}", playerName);

  return { imagePath, label, description };
}

export function getPiecePosition(rank: number, file: number): CSSProperties {
  const x = file * 100;
  const y = (7 - rank) * 100;

  return {
    translate: `${x}% ${y}%`,
  };
}

export function getCoords(
  e: React.DragEvent<HTMLDivElement>,
  ref: React.RefObject<HTMLDivElement | null>,
  tileSize: number,
) {
  if (!ref.current) return { x: -1, y: -1 };
  const { top, left } = ref.current.getBoundingClientRect();
  const x = Math.floor((e.clientX - left) / tileSize);
  const y = 7 - Math.floor((e.clientY - top) / tileSize);

  return { x, y };
}

export function createPosition() {
  const position = new Array(8).fill("").map(() => new Array(8).fill(""));

  for (let i = 0; i < 8; i++) {
    position[6][i] = PIECES.BP;
    position[1][i] = PIECES.WP;
  }

  position[0][0] = PIECES.WR;
  position[0][1] = PIECES.WN;
  position[0][2] = PIECES.WB;
  position[0][3] = PIECES.WQ;
  position[0][4] = PIECES.WK;
  position[0][5] = PIECES.WB;
  position[0][6] = PIECES.WN;
  position[0][7] = PIECES.WR;
  position[7][0] = PIECES.BR;
  position[7][1] = PIECES.BN;
  position[7][2] = PIECES.BB;
  position[7][3] = PIECES.BQ;
  position[7][4] = PIECES.BK;
  position[7][5] = PIECES.BB;
  position[7][6] = PIECES.BN;
  position[7][7] = PIECES.BR;

  // a stalmate position before a move
  // position[6][0] = PIECES.BK;
  // position[7][5] = PIECES.WR;
  // position[4][2] = PIECES.WK;
  // position[0][7] = PIECES.WQ;

  // a insufficient material position before a move
  // position[7][4] = PIECES.BK;
  // position[5][5] = PIECES.WB;
  // position[6][6] = PIECES.BP;
  // position[0][0] = PIECES.WK;

  // a checkmate position before a move
  // position[6][0] = PIECES.BK;
  // position[7][1] = PIECES.WR;
  // position[4][2] = PIECES.WK;
  // position[0][7] = PIECES.WQ;

  // a promotion position before 2 moves
  // position[5][0] = PIECES.WP;
  // position[7][3] = PIECES.BK;
  // position[0][0] = PIECES.WK;

  // castling position before move
  // position[0][4] = PIECES.WK;
  // position[0][7] = PIECES.WR;
  // position[0][0] = PIECES.WR;
  // position[1][1] = PIECES.WP;
  // position[7][4] = PIECES.BK;
  // position[6][5] = PIECES.BP;
  // position[7][7] = PIECES.BR;
  // position[7][0] = PIECES.BR;

  return position;
}

export function extractLastPosition(positions: string[][][]) {
  const lastPosition = positions[positions.length - 1];
  if (!lastPosition) return;
  return lastPosition;
}

export function extractPositionAtIndex(positions: string[][][], index: number) {
  const position = positions[index];
  if (!position) return;
  return position;
}

export function extractPositionAtLastIndex(
  positions: string[][][],
  lastIndex: number,
) {
  const position = positions[positions.length - lastIndex];
  if (!position) return;
  return position;
}

export function getPieceNotation(piece: string): string {
  return PIECE_NOTATIONS[piece] || "";
}

export function getPieceType(piece: string): string {
  return PIECE_TYPE[piece] || "";
}

export function getEnemy(piece: string): string {
  const player = piece[0];
  return player === "w" ? "b" : "w";
}

export function isEnemyPiece(enemy: string, piece: string): boolean {
  if (!piece) return false;
  return enemy === piece[0];
}

export function isFriendlyPiece(piece: string, otherPiece: string): boolean {
  if (!piece || !otherPiece) return false;
  return piece[0] === otherPiece[0];
}

export function isPlayerTurn(turn: PlayerTurnType, piece: string): boolean {
  return isFriendlyPiece(turn, piece);
}

export function convertAlgebraicToCoords(square: string): {
  rank: number;
  file: number;
} {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const file = files.indexOf(square[0]);
  const rank = +square[1] - 1;
  return { rank, file };
}

export function convertCoordsToAlgebraic(rank: number, file: number): string {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${files[file]}${rank + 1}`;
}
