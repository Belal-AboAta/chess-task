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

export const PIECE_NOTATIONS: Record<keyof typeof PIECES, string> = {
  WK: "K",
  WQ: "Q",
  WR: "R",
  WB: "B",
  WN: "N",
  WP: "",
  BK: "K",
  BQ: "Q",
  BR: "R",
  BB: "B",
  BN: "N",
  BP: "",
};
