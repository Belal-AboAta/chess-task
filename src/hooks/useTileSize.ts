export const useTileSize = (boardWidth: number, tilesPerRow: number = 8) => {
  const tileSize = boardWidth / tilesPerRow;

  return {
    tileSize,
  };
};
