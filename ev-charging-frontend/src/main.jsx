import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

// document.getElementById('root')
// B1: tìm tới thẻ có tên là root
// B2: render

// chương trình sẽ chạy từ thằng main
