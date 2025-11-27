import clsx from "clsx";

import { getSocket } from "@/socket/socket";
import { useAppDispatch } from "@/store/hooks";
import { setNewGame } from "@/store/positionSlice";
import { ChessKing } from "lucide-react";
import { setGameMode } from "@/store/gameSlice";

export interface GameControllsProps {
  tileSize: number;
}

export const GameControlls = ({ tileSize }: GameControllsProps) => {
  const dispatch = useAppDispatch();

  const socket = getSocket();
  const ICONS = [
    {
      icon: <ChessKing size={tileSize / 4} />,
      action: () => {
        if (socket) {
          dispatch(setNewGame());
          socket.emit("leave-room");
          dispatch(setGameMode("waiting"));
        }
      },
      title: "New Game",
      isDisabled: false,
    },
  ];

  return (
    <div className="flex flex-row justify-center items-center p-4">
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
