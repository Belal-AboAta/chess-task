export type GameStateType = "ongoing" | "checkmate" | "draw" | "promotion";

export type castleDirction = "both" | "right" | "left" | "none";
export type castlingDirection = {
  w: {
    direction: castleDirction;
  };
  b: {
    direction: castleDirction;
  };
};
