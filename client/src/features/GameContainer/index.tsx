import { useEffect } from "react";

import { useSocketEvents } from "@/hooks/useSocketEvents";
import { socketManager } from "@/socket/socket";
import { selectGameMode, selectOpponentConnected } from "@/store/gameSlice";
import { useAppSelector } from "@/store/hooks";

import { Board } from "../Board";
import { BoardStatus } from "../Board/components/BoardStatus";
import { Lobby } from "../Lobby";

export const GameContainer: React.FC = () => {
  const opponentConnected = useAppSelector(selectOpponentConnected);
  const gameMode = useAppSelector(selectGameMode);

  useEffect(() => {
    socketManager.connect();
  }, []);

  useSocketEvents();

  if (gameMode === "playing" && opponentConnected) {
    return (
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8 items-center justify-center">
        <Board />
        <BoardStatus />
      </div>
    );
  }

  return <Lobby />;
};
