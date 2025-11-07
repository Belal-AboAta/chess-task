import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedTile,
  selectSelectedTile,
  setSelectedTile,
} from "@/store/positionSlice";

export const useSelectedTile = () => {
  const dispatch = useAppDispatch();
  const selectedTile = useAppSelector(selectSelectedTile);

  const changeSelectedTile = (rank: number, file: number) => {
    dispatch(setSelectedTile([rank, file]));
  };

  const removeSelectedTile = () => {
    dispatch(clearSelectedTile());
  };
  return {
    selectedTile,
    changeSelectedTile,
    removeSelectedTile,
  };
};
