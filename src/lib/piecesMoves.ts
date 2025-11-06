import { PIECE_TYPE, PIECES, PIECES_DIRECTIONS } from "@/constants/pieces";

import { getEnemy, getPieceType, isEnemyPiece, isFriendlyPiece } from "./utils";

export type MovesType = number[][];

export interface ISlidingMovesParams {
  position: string[][];
  direction: number[][];
  piece: string;
  rank: string;
  file: string;
  moves: MovesType;
  enemy: string;
}

export interface IMovesParams {
  position: string[][];
  piece: string;
  rank: string;
  file: string;
  prevPosition?: string[][];
  castleDirection?: string;
}

export const getSlidingMoves = ({
  position,
  direction,
  piece,
  rank,
  file,
  moves,
  enemy,
}: ISlidingMovesParams) => {
  for (const dir of direction) {
    const newRank = +rank + dir[0];
    const newFile = +file + dir[1];
    const tile = position?.[newRank]?.[newFile];
    if (tile === undefined) break;
    if (isEnemyPiece(enemy, tile)) {
      moves.push([newRank, newFile]);
      break;
    }
    if (isFriendlyPiece(piece, tile)) {
      break;
    }
    moves.push([newRank, newFile]);
  }
};

export const getPawnMoves = ({ position, piece, rank, file }: IMovesParams) => {
  const moves: MovesType = [];
  const dir = piece === PIECES.WP ? 1 : -1;

  const rankNum = +rank;
  const fileNum = +file;

  const isFirstPawnMove = rankNum % 5 === 1;
  const oneStepAhead = position?.[rankNum + dir]?.[fileNum];
  const twoStepsAhead = position?.[rankNum + dir * 2]?.[fileNum];

  // Move two tiles on first move
  if (isFirstPawnMove && !oneStepAhead && !twoStepsAhead) {
    moves.push([rankNum + dir * 2, fileNum]);
  }

  // Move one tile
  if (!oneStepAhead) {
    moves.push([rankNum + dir, fileNum]);
  }

  return moves;
};

export const getPieceMoves = ({
  position,
  piece,
  rank,
  file,
}: IMovesParams) => {
  const pieceType = getPieceType(piece);

  if (pieceType === PIECE_TYPE[PIECES.WP]) {
    return getPawnMoves({ position, piece, rank, file });
  }

  const directionsConfig = PIECES_DIRECTIONS[pieceType];
  if (!directionsConfig) return [];

  const { directions, slides } = directionsConfig;
  const moves: MovesType = [];
  const enemy = getEnemy(piece);

  if (slides) {
    for (const candidate of directions) {
      getSlidingMoves({
        position,
        direction: candidate as number[][],
        piece,
        rank,
        file,
        moves,
        enemy,
      });
    }
  }
  directions.forEach((dir) => {
    const newRank = +rank + (dir[0] as number);
    const newFile = +file + (dir[1] as number);
    const tile = position?.[newRank]?.[newFile];
    if (tile !== undefined && (isEnemyPiece(enemy, tile) || tile === "")) {
      moves.push([newRank, newFile]);
    }
  });

  return moves;
};
