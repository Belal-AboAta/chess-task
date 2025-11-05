import { Provider } from "react-redux";

import { store } from "@/store";

function App() {
  return (
    <Provider store={store}>
      <div>Hello World!</div>
    </Provider>
  );
}

export default App;
