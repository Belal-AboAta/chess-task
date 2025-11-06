import { useEffect, useState, type RefObject } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export const useBoardSize = (boardRef: RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const size = useWindowSize();
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;

        setWidth(newWidth);
        setHeight(newHeight);
      }
    };

    updateSize();
  }, [boardRef, size]);

  return {
    width,
    height,
  };
};
