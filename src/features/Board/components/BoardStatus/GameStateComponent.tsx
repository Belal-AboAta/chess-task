import { getGameStateInfo } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectGameState, selectTurn } from "@/store/positionSlice";

export interface GameStateComponentProps {
  tileSize: number;
}

export const GameStateComponent = ({ tileSize }: GameStateComponentProps) => {
  const gameState = useAppSelector(selectGameState);
  const turn = useAppSelector(selectTurn);

  const { imagePath, label, description } = getGameStateInfo(gameState, turn);
  return (
    <div className="flex  items-center gap-4">
      {imagePath && (
        <img
          src={imagePath}
          alt="Game State"
          style={{ width: tileSize, height: tileSize }}
        />
      )}
      <div className="translate-y-1/8">
        <h3
          className="font-semibold text-gray-200"
          style={{
            fontSize: Math.max(tileSize / 8, 18),
          }}
        >
          {label}
        </h3>
        <p
          className="text-sm md:text-base text-gray-400"
          style={{
            fontSize: Math.max(tileSize / 8, 12),
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
