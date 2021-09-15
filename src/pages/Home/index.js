import React from "react";
import { Route } from "react-router-dom";
import News from "../News";
import Index from "../index";
import Profile from "../Profile";
import HouseList from "../HouseList";
import { TabBar } from "antd-mobile";
import "./index.css";

const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
];

/**
 * 问题：点击首页导航菜单，导航到 找房列表 页面时，找房菜单没有高亮
 * 原因：之前实现该功能时，只考虑了点击以及第一次加载home组件的情况，但是，没有考虑不重新加载home组件时的路由切换
 * 解决：在路由切换时，也执行菜单高亮的逻辑代码
 * 1、添加componentDidUpdate钩子函数
 * 2、在钩子函数中判断路由地址是否切换(因为路由信息是通过props传递给组件的，所以，可以比较更新前后的两个props)
 * 3、在路由地址切换时，让菜单高亮
 */

export default class Home extends React.Component {
  //状态控制
  state = {
    //默认选中的TabBar菜单项
    selectedTab: this.props.location.pathname,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      //此时路由发生了切换
      this.setState({
        selectedTab: this.props.location.pathname,
      });
    }
  }

  renderTabBarItem() {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          //路由切换
          this.props.history.push(item.path);
        }}
      ></TabBar.Item>
    ));
  }

  render() {
    return (
      <div className="home">
        {/**渲染子路由 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/**tabbar */}
        <TabBar tintColor="#21b97a" noRenderContent={true} barTintColor="white">
          {this.renderTabBarItem()}
          {/* <TabBar.Item
            title="首页"
            key="Life"
            icon={<i className="iconfont icon-ind" />}
            selectedIcon={<i className="iconfont icon-ind" />}
            selected={this.state.selectedTab === "/home/index"}
            onPress={() => {
              this.setState({
                selectedTab: "/home/index",
              });
              //路由切换
              this.props.history.push("/home/index");
            }}
            data-seed="logId"
          ></TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse" />}
            selectedIcon={<i className="iconfont icon-findHouse" />}
            title="找房"
            key="Koubei"
            selected={this.state.selectedTab === "/home/list"}
            onPress={() => {
              this.setState({
                selectedTab: "/home/list",
              });
              //路由切换
              this.props.history.push("/home/list");
            }}
            data-seed="logId1"
          ></TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-infom" />}
            selectedIcon={<i className="iconfont icon-infom" />}
            title="资讯"
            key="Friend"
            selected={this.state.selectedTab === "/home/news"}
            onPress={() => {
              this.setState({
                selectedTab: "/home/news",
              });
              //路由切换
              this.props.history.push("/home/news");
            }}
          ></TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-my" />}
            selectedIcon={<i className="iconfont icon-my" />}
            title="我的"
            key="my"
            selected={this.state.selectedTab === "/home/profile"}
            onPress={() => {
              this.setState({
                selectedTab: "/home/profile",
              });
              //路由切换
              this.props.history.push("/home/profile");
            }}
          ></TabBar.Item> */}
        </TabBar>
      </div>
    );
  }
}
