import React from "react";
import ReactDOM from "react-dom";

//导入antd-mobile的样式
import "antd-mobile/dist/antd-mobile.css";
//自定义样式需放在最后引入，否则会被覆盖
import "./index.css";

import "react-virtualized/styles.css";

import "./assets/fonts/iconfont.css";

//自己写的全局样式应该保证最后导入，所以，App需要最后导入
import App from "./App";

import "./utils/url";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
