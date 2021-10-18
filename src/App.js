import React from "react";

//导入路由组件：router、route、link
//使用路由组件配置首页和城市选择页面
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

//导入首页和城市选择两个组件（页面）
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map";

//导入要使用的组件
import { Button } from "antd-mobile";

function App() {
  return (
    <Router>
      <div className="App">
        {/**项目根组件<Button>登录</Button> */}
        {/**配置导航菜单 to和path需要匹配才可以*/}

        {/**斜杆是指默认路由,默认路由匹配时，跳转到/home实现路由重定向到首页*/}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        {/**配置路由 */}
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/map" component={Map}></Route>
      </div>
    </Router>
  );
}

export default App;
