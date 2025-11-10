import clsx from "clsx";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectGameState,
  selectPositions,
  setNewGame,
  undomMove,
} from "@/store/positionSlice";
import { ChessKing, Undo2Icon } from "lucide-react";

export interface GameControllsProps {
  tileSize: number;
}

export const GameControlls = ({ tileSize }: GameControllsProps) => {
  const positions = useAppSelector(selectPositions);
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();
  const ICONS = [
    {
      icon: <Undo2Icon size={tileSize / 4} />,
      action: () => dispatch(undomMove()),
      title: "Undo Move",
      isDisabled: positions.length <= 1 || gameState !== "ongoing",
    },
    {
      icon: <ChessKing size={tileSize / 4} />,
      action: () => dispatch(setNewGame()),
      title: "New Game",
    },
  ];

  return (
    <div className="flex flex-row justify-between items-center p-4">
      {ICONS.map((control, index) => (
        <button
          key={index}
          onClick={control.action}
          className={clsx(
            "m-4 p-2 hover:bg-gray-600 transition cursor-pointer rounded-full",
            control.isDisabled &&
              "opacity-50 cursor-not-allowed hover:bg-transparent",
          )}
          title={control.title}
          disabled={control.isDisabled}
        >
          {control.icon}
        </button>
      ))}
    </div>
  );
};
