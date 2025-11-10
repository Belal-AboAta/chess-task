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

export interface IGetCheckTileParams {
  positionAfterMove: string[][];
  position: string[][];
  piece: string;
}

export interface IGetTileClassParams {
  candidateMoves: MovesType;
  kingCheckedTile: [number, number] | null;
  position: string[][];
  rank: number;
  file: number;
  selectedTile?: [number, number];
}

export interface IGetAllValidMovesParams {
  positionAfterMove: string[][];
  position: string[][];
  pieces: ReturnType<typeof getEnemyPieces>;
  moves: MovesType;
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

  const pawnStartRank = piece === PIECES.WP ? 1 : 6;
  const isFirstPawnMove = rankNum === pawnStartRank;
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
      if (
        positionAfterMove?.[x]?.[y] &&
        positionAfterMove?.[x]?.[y] === enemyKing
      ) {
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

  let isCapture = false;
  let promotionSquare;

  // Handle Castling
  // TODO: Handle castling with flip board effect
  if (isPieceKing && Math.abs(to.file - from.file) > 1) {
    // Castles
    if (to.file === 2) {
      // Castles Long
      newPosition[from.rank][0] = "";
      newPosition[from.rank][3] = piece.startsWith("w") ? PIECES.WR : PIECES.BR;
    }
    if (to.file === 6) {
      // Castles Short
      newPosition[from.rank][7] = "";
      newPosition[from.rank][5] = piece.startsWith("w") ? PIECES.WR : PIECES.BR;
    }
  }

  if (isPiecePawn && (to.rank === 0 || to.rank === 7)) {
    promotionSquare = {
      from: {
        ...from,
      },
      to: {
        ...to,
      },
    };
  }

  // EnPassant capture
  if (
    isPiecePawn &&
    from.file !== to.file &&
    position[to.rank][to.file] === ""
  ) {
    // Capturing EnPassant
    newPosition[from.rank][to.file] = "";
    isCapture = true;
  }

  if (position[to.rank][to.file] !== "") {
    isCapture = true;
  }

  newPosition[to.rank][to.file] = piece;
  newPosition[from.rank][from.file] = "";

  return {
    newPosition,
    isCapture,
    promotionSquare,
  };
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
    const { newPosition } = preformMove({
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

export function getCheckTile({
  positionAfterMove,
  position,
  piece,
}: IGetCheckTileParams) {
  const isTileChecked = isPlayerInCheck({
    positionAfterMove,
    position,
    piece,
  });
  if (!isTileChecked) return null;

  const enemy = getEnemy(piece);
  const kingPos = getKingPosition({
    position: positionAfterMove,
    piece: enemy,
  });

  return kingPos;
}

export function getTileClass({
  candidateMoves,
  position,
  kingCheckedTile,
  rank,
  file,
  selectedTile,
}: IGetTileClassParams) {
  const tile = position[rank][file];

  for (const [x, y] of candidateMoves) {
    const [selRank, selFile] = selectedTile || [-1, -1];
    if (x === rank && y === file) {
      if (selRank === rank && selFile === file) return "selected";
      if (tile === "") {
        return "highlight";
      } else {
        return "attacking";
      }
    }
  }

  if (kingCheckedTile) {
    const [kingRank, kingFile] = kingCheckedTile;
    if (kingRank === rank && kingFile === file) {
      return "checked";
    }
  }
}

export function getAllValidMoves({
  positionAfterMove,
  position,
  pieces,
  moves,
}: IGetAllValidMovesParams) {
  for (const p of pieces) {
    const validMoves = getValidMoves({
      position: positionAfterMove,
      prevPosition: position,
      piece: p.piece,
      rank: p.rank.toString(),
      file: p.file.toString(),
    });
    moves.push(...validMoves);
  }
}

export function isStalematePosition({
  positionAfterMove,
  position,
  piece,
}: IIsPlayerInCheckParams) {
  const isInCheck = isPlayerInCheck({ positionAfterMove, position, piece });
  if (isInCheck) return false;
  const pieces = getEnemyPieces({
    position,
    piece,
  });
  const moves: MovesType = [];

  getAllValidMoves({
    positionAfterMove,
    position,
    pieces,
    moves,
  });
  return !isInCheck && moves.length === 0;
}

export const isInsufficientMaterial = (position: string[][]) => {
  const pieces = [
    ...getEnemyPieces({ position, piece: "wk" }).map((p) => p.piece),
    ...getEnemyPieces({ position, piece: "bk" }).map((p) => p.piece),
  ];

  // King vs. king
  if (pieces.length === 2) return true;

  // King and bishop vs. king
  // King and knight vs. king
  if (
    pieces.length === 3 &&
    pieces.some(
      (p) =>
        getPieceType(p) === PIECE_TYPE[PIECES.BB] ||
        getPieceType(p) === PIECE_TYPE[PIECES.BN],
    )
  )
    return true;

  // King and bishop vs. king and bishop of the same color as the opponent's bishop
  if (
    pieces.length === 4 &&
    pieces.every(
      (p) =>
        getPieceType(p) === PIECE_TYPE[PIECES.BB] ||
        getPieceType(p) === PIECE_TYPE[PIECES.BK],
    ) &&
    new Set(pieces).size === 4
  )
    return true;

  return false;
};

export function isCheckMate({
  positionAfterMove,
  position,
  piece,
}: IIsPlayerInCheckParams) {
  const enemy = getEnemy(piece);
  const realPiece = enemy === "w" ? PIECES.WK : PIECES.BK;
  const pieces = getEnemyPieces({
    position,
    piece,
  });
  const isInCheck = isPlayerInCheck({
    positionAfterMove,
    position,
    piece: realPiece,
  });
  if (!isInCheck) return false;

  const moves: MovesType = [];

  getAllValidMoves({
    positionAfterMove,
    position,
    pieces,
    moves,
  });

  return isInCheck && moves.length === 0;
}

// isCheckMate : function(position,player,castleDirection) {
//     const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})
//
//     if (!isInCheck)
//         return false
//
//     const pieces = getPieces(position,player)
//     const moves = pieces.reduce((acc,p) => acc = [
//         ...acc,
//         ...(getValidMoves({
//                 position,
//                 castleDirection,
//                 ...p
//             })
//         )
//     ], [])
//
//     return (isInCheck && moves.length === 0)
// },
//
//
