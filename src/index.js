import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

//导入antd-mobile的样式
import "antd-mobile/dist/antd-mobile.css";
//自定义样式需放在最后引入，否则会被覆盖
import "./index.css";

import "./assets/fonts/iconfont.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
