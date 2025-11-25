import { Provider } from "react-redux";

import { store } from "@/store";

import { PromotionBox } from "./features/PromotionBox";
import { GameContainer } from "./features/GameContainer";

function App() {
  return (
    <Provider store={store}>
      <GameContainer />
      <PromotionBox />
    </Provider>
  );
}

export default App;
