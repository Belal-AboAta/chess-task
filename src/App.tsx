import { Provider } from "react-redux";

import { Board } from "@/features/Board";
import { store } from "@/store";
import { BoardStatus } from "@/features/Board/components/BoardStatus";

function App() {
  return (
    <Provider store={store}>
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8 items-center justify-center">
        <Board />
        <BoardStatus />
      </div>
    </Provider>
  );
}

export default App;
