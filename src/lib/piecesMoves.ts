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

export interface IGetPieceParams {
  position: string[][];
  piece: string;
}

export interface IPiecePosition {
  piece: string;
  rank: number;
  file: number;
}

export interface IGetKingPositionParams {
  position: string[][];
  piece: string;
}

export interface IIsPlayerInCheckParams {
  positionAfterMove: string[][];
  position: string[][];
  piece: string;
}

export interface IPerfromMoveParams {
  position: string[][];
  from: {
    rank: number;
    file: number;
  };
  to: {
    rank: number;
    file: number;
  };
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

export const getPawnMoves = ({
  prevPosition,
  position,
  piece,
  rank,
  file,
}: IMovesParams) => {
  const moves: MovesType = [];
  // TODO: Handle flip board effect
  const dir = piece === PIECES.WP ? 1 : -1;
  const enemy = getEnemy(piece);

  const rankNum = +rank;
  const fileNum = +file;

  const isFirstPawnMove = rankNum % 5 === 1;
  const oneStepAhead = position?.[rankNum + dir]?.[fileNum];
  const twoStepsAhead = position?.[rankNum + dir * 2]?.[fileNum];

  const tileCrossLeft = position?.[rankNum + dir]?.[fileNum - 1];
  const tileCrossRight = position?.[rankNum + dir]?.[fileNum + 1];

  const isEnemyCrossLeft = tileCrossLeft && isEnemyPiece(enemy, tileCrossLeft);
  const isEnemyCrossRight =
    tileCrossRight && isEnemyPiece(enemy, tileCrossRight);

  const tileLeft = position?.[rankNum]?.[fileNum - 1];
  const tileRight = position?.[rankNum]?.[fileNum + 1];

  const isEnemyLeft = tileLeft && isEnemyPiece(enemy, tileLeft);
  const isEnemyRight = tileRight && isEnemyPiece(enemy, tileRight);

  const enPassantLeftTile = position?.[rankNum + dir * 2]?.[fileNum - 1];
  const enPassantRightTile = position?.[rankNum + dir * 2]?.[fileNum + 1];

  const isEnPassantLeftEmpty = enPassantLeftTile === "";
  const isEnPassantRightEmpty = enPassantRightTile === "";

  // Move two tiles on first move
  if (isFirstPawnMove && !oneStepAhead && !twoStepsAhead) {
    moves.push([rankNum + dir * 2, fileNum]);
  }

  // Move one tile
  if (!oneStepAhead) {
    moves.push([rankNum + dir, fileNum]);
  }

  // Pawn Captures
  if (isEnemyCrossLeft) {
    moves.push([rankNum + dir, fileNum - 1]);
  }

  if (isEnemyCrossRight) {
    moves.push([rankNum + dir, fileNum + 1]);
  }

  // EnPassant
  if (prevPosition) {
    const isEnPassantPossibleLeft =
      isEnemyLeft &&
      isEnPassantLeftEmpty &&
      prevPosition?.[rankNum]?.[fileNum - 1] === "" &&
      isEnemyPiece(enemy, prevPosition?.[rankNum + dir * 2]?.[fileNum - 1]);

    const isEnPassantPossibleRight =
      isEnemyRight &&
      isEnPassantRightEmpty &&
      prevPosition?.[rankNum]?.[fileNum + 1] === "" &&
      isEnemyPiece(enemy, prevPosition?.[rankNum + dir * 2]?.[fileNum + 1]);

    if ((dir === 1 && rankNum === 4) || (dir === -1 && rankNum === 3)) {
      // Check left
      if (isEnPassantPossibleLeft) {
        moves.push([rankNum + dir, fileNum - 1]);
      }

      // Check right
      if (isEnPassantPossibleRight) {
        moves.push([rankNum + dir, fileNum + 1]);
      }
    }
  }

  return moves;
};

export const getPieceMoves = ({
  prevPosition,
  position,
  piece,
  rank,
  file,
}: IMovesParams) => {
  const pieceType = getPieceType(piece);

  if (pieceType === PIECE_TYPE[PIECES.WP]) {
    return getPawnMoves({ prevPosition, position, piece, rank, file });
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

  // TODO: add Castling moves for King

  return moves;
};

export const getEnemyPieces = ({ position, piece }: IGetPieceParams) => {
  const enemy = getEnemy(piece);
  const enemyPieces: IPiecePosition[] = [];
  position.forEach((rank, x) => {
    rank.forEach((_, y) => {
      const tile = position[x][y];
      const isEnemy = isEnemyPiece(enemy, tile);
      if (isEnemy)
        enemyPieces.push({
          piece: position[x][y],
          rank: x,
          file: y,
        });
    });
  });
  return enemyPieces;
};

export const getKingPosition = ({
  position,
  piece,
}: IGetKingPositionParams) => {
  let kingPos!: [number, number];
  const enemy = getEnemy(piece);
  position.forEach((rank, x) => {
    rank.forEach((_, y) => {
      const tile = position[x][y];
      const isPlayerPiece = !!tile && !isEnemyPiece(enemy, tile);

      if (!isPlayerPiece && getPieceType(tile) === PIECE_TYPE[PIECES.BK])
        kingPos = [x, y];
    });
  });
  return kingPos;
};

export function isPlayerInCheck({
  positionAfterMove,
  position,
  piece,
}: IIsPlayerInCheckParams) {
  const enemy = getEnemy(piece);
  const enemyKing = enemy === "w" ? PIECES.BK : PIECES.WK;
  const enemyPieces = getEnemyPieces({ position: positionAfterMove, piece });

  for (const p of enemyPieces) {
    const moves = getPieceMoves({
      position: positionAfterMove,
      prevPosition: position,
      piece: p.piece,
      rank: p.rank.toString(),
      file: p.file.toString(),
    });

    for (const [x, y] of moves) {
      if (positionAfterMove[x][y] === enemyKing) {
        return true;
      }
    }
  }

  return false;
}

export function preformMove({ position, from, to }: IPerfromMoveParams) {
  const newPosition = [...position.map((row) => [...row])];

  const piece = position[from.rank][from.file];
  const isPiecePawn = getPieceType(piece) === PIECE_TYPE[PIECES.WP];
  const isPieceKing = getPieceType(piece) === PIECE_TYPE[PIECES.WK];

  // Handle Castling
  // TODO: Handle castling with flip board effect
  if (isPieceKing && Math.abs(to.file - from.file) > 1) {
    // Castles
    if (to.file === 2) {
      // Castles Long
      newPosition[from.rank][0] = "";
      newPosition[from.rank][3] = piece.startsWith("w") ? "wr" : "br";
    }
    if (to.file === 6) {
      // Castles Short
      newPosition[from.rank][7] = "";
      newPosition[from.rank][5] = piece.startsWith("w") ? "wr" : "br";
    }
  }

  // EnPassant capture
  if (
    isPiecePawn &&
    from.file !== to.file &&
    position[to.rank][to.file] === ""
  ) {
    // Capturing EnPassant
    newPosition[from.rank][to.file] = "";
  }

  newPosition[to.rank][to.file] = piece;
  newPosition[from.rank][from.file] = "";

  return newPosition;
}

export function getValidMoves({
  position,
  piece,
  rank,
  file,
  prevPosition,
}: IMovesParams) {
  const possibleMoves = getPieceMoves({
    position,
    piece,
    rank,
    file,
    prevPosition,
  });

  const validMoves: MovesType = [];

  for (const [x, y] of possibleMoves) {
    const newPosition = preformMove({
      position,
      from: { rank: Number(rank), file: Number(file) },
      to: { rank: x, file: y },
    });

    const isInCheck = isPlayerInCheck({
      positionAfterMove: newPosition,
      position,
      piece,
    });

    if (!isInCheck) {
      validMoves.push([x, y]);
    }
  }

  return validMoves;
}
