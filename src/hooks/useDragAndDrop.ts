import type { PieceProps } from "@/features/Pieces/components/Piece";

export const useDragAndDrop = () => {
  const onDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    { piece, rank, file }: PieceProps,
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    setTimeout(() => {
      const element = e.target as HTMLImageElement;
      element.style.display = "none";
    }, 0);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, onDropCB: () => void) => {
    e.preventDefault();
    onDropCB();
  };

  const onDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    const element = e.target as HTMLImageElement;

    element.style.display = "block";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    onDragStart,
    onDrop,
    onDragOver,
    onDragEnd,
  };
};
