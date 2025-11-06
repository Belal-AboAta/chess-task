import { Provider } from "react-redux";

import { Board } from "@/features/Board";
import { store } from "@/store";

function App() {
  return (
    <Provider store={store}>
      <Board />
    </Provider>
  );
}

export default App;
