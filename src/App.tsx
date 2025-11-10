import { Provider } from "react-redux";

import { Board } from "@/features/Board";
import { BoardStatus } from "@/features/Board/components/BoardStatus";
import { store } from "@/store";
import { PromotionBox } from "./features/PromotionBox";

function App() {
  return (
    <Provider store={store}>
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8 items-center justify-center">
        <Board />
        <BoardStatus />
      </div>
      <PromotionBox />
    </Provider>
  );
}

export default App;
