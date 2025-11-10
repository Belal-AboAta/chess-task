import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeRespective,
  selectRespective,
} from "@/store/playerRespectiveSlice";
import { selectPositions, setPosition } from "@/store/positionSlice";
import { extractLastPosition } from "@/lib/utils";

export const usePosition = () => {
  const dispatch = useAppDispatch();
  const respective = useAppSelector(selectRespective);
  const positions = useAppSelector(selectPositions);
  const [firstRender, setFirstRender] = useState(true);

  const currentPosition = extractLastPosition(positions);

  // TODO: implement flipboard later
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (!currentPosition) return;
    const reveresedPosition = currentPosition
      .map((row) => [...row].reverse())
      .reverse();

    dispatch(setPosition(reveresedPosition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, respective]);

  const flipBoard = () => {
    dispatch(changeRespective());
  };

  return {
    currentPosition,
    flipBoard,
  };
};
