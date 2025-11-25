import { useAppSelector } from "@/store/hooks";
import { selectTileSize } from "@/store/tileSizeSlice";

import { GameStateComponent } from "./GameStateComponent";
import { GameControlls } from "./GameControlls";

export const BoardStatus = () => {
  const tileSize = useAppSelector(selectTileSize);

  return (
    <div className="bg-box-background rounded-lg shadow w-64 md:w-[500px]">
      <div className="h-80 flex flex-col">
        <h2 className="text-base md:text-xl text-center text-gray-300 font-medium py-2 border-b border-b-gray-500">
          Game Status
        </h2>
        <div className="flex-1 flex flex-row items-center justify-center border-b border-b-gray-500">
          <GameStateComponent tileSize={tileSize} />
        </div>
      </div>
      <GameControlls tileSize={tileSize} />
    </div>
  );
};
