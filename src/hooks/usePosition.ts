import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeRespective } from "@/store/playerRespectiveSlice";
import { selectPositions } from "@/store/positionSlice";
import { extractLastPosition } from "@/lib/utils";

export const usePosition = () => {
  const dispatch = useAppDispatch();
  const positions = useAppSelector(selectPositions);

  const currentPosition = extractLastPosition(positions);

  // TODO: implement flipboard logic later
  const flipBoard = () => {
    dispatch(changeRespective());
  };

  return {
    currentPosition,
    flipBoard,
  };
};
