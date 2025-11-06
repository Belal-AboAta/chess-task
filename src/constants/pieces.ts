export const PIECES = {
  WK: "wk",
  WQ: "wq",
  WR: "wr",
  WB: "wb",
  WN: "wn",
  WP: "wp",
  BK: "bk",
  BQ: "bq",
  BR: "br",
  BB: "bb",
  BN: "bn",
  BP: "bp",
};

type PieceKey = (typeof PIECES)[keyof typeof PIECES];

export const PIECE_NOTATIONS: Record<PieceKey, string> = {
  [PIECES.WK]: "K",
  [PIECES.WQ]: "Q",
  [PIECES.WR]: "R",
  [PIECES.WB]: "B",
  [PIECES.WN]: "N",
  [PIECES.WP]: "",
  [PIECES.BK]: "K",
  [PIECES.BQ]: "Q",
  [PIECES.BR]: "R",
  [PIECES.BB]: "B",
  [PIECES.BN]: "N",
  [PIECES.BP]: "",
};

export const PIECE_TYPE: Record<PieceKey, string> = {
  ...PIECE_NOTATIONS,
  [PIECES.WP]: "P",
  [PIECES.BP]: "P",
};

type PieceTypeKey = (typeof PIECE_TYPE)[keyof typeof PIECE_TYPE];

const ARRAY_8 = new Array(8).fill(0);

const ROOK_DIRECTIONS: number[][][] = [
  ARRAY_8.map((_, i) => [-(i + 1), 0]),
  ARRAY_8.map((_, i) => [i + 1, 0]),
  ARRAY_8.map((_, i) => [0, -(i + 1)]),
  ARRAY_8.map((_, i) => [0, i + 1]),
];

const BISHOP_MOVES: number[][][] = [
  ARRAY_8.map((_, i) => [-(i + 1), -(i + 1)]),
  ARRAY_8.map((_, i) => [-(i + 1), i + 1]),
  ARRAY_8.map((_, i) => [i + 1, -(i + 1)]),
  ARRAY_8.map((_, i) => [i + 1, i + 1]),
];

const KNIGHT_DIRECTIONS: number[][] = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const KING_DIRECTIONS: number[][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

type PieceDirectionConfig =
  | { directions: number[][][]; slides: true }
  | { directions: number[][]; slides: false };

export const PIECES_DIRECTIONS: Record<PieceTypeKey, PieceDirectionConfig> = {
  [PIECE_TYPE[PIECES.WR]]: { directions: ROOK_DIRECTIONS, slides: true },
  [PIECE_TYPE[PIECES.WN]]: { directions: KNIGHT_DIRECTIONS, slides: false },
  [PIECE_TYPE[PIECES.WB]]: { directions: BISHOP_MOVES, slides: true },
  [PIECE_TYPE[PIECES.WQ]]: {
    directions: [...ROOK_DIRECTIONS, ...BISHOP_MOVES],
    slides: true,
  },
  [PIECE_TYPE[PIECES.WK]]: { directions: KING_DIRECTIONS, slides: false },
};
