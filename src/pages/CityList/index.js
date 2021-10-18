import React from "react";
import { NavBar, Toast } from "antd-mobile";
import "./index.scss";
import axios from "axios";
import { List, AutoSizer } from "react-virtualized";
import { getCurrentCity } from "../../utils";
import NavHeader from "../../components/NavHeader";

const TITLE_HEIGHT = 36;
const NAME_HEIGHT = 50;
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

//与状态无关的方法均可放在类的外面
const formatCityList = (list) => {
  const cityList = {};
  // const cityIndex = [];
  list.forEach((item) => {
    const first = item.short.substr(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  });
  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex,
  };
};

const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

//渲染城市列表
// const list = Array(100).fill("abc");

//组件的创建流程：
//1、在state中定义一个变量
//2、创建一个方法用于从后端接口获取数据
//3、在组件的某个生命周期调用步骤二中的方法，获取数据
//4、将数据渲染在页面上
export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    };
    this.cityListComponent = React.createRef();
  }

  async componentDidMount() {
    await this.getCityList();
    this.cityListComponent.current.measureAllRows();
  }

  async getCityList() {
    const res = await axios.get("http://localhost:8009/area/city?level=1");
    // console.log("城市列表数据：", res);
    const { cityList, cityIndex } = formatCityList(res.data.body);
    // console.log(cityList, cityIndex);
    const hotRes = await axios.get("http://localhost:8009/area/hot");
    // console.log("热门城市：", hotRes);
    cityList["hot"] = hotRes.data.body;
    cityIndex.unshift("hot");
    const curCity = await getCurrentCity();
    // console.log("curcity2", curCity);
    cityList["#"] = [curCity];
    cityIndex.unshift("#");
    // console.log(cityList, cityIndex);

    this.setState({
      cityList,
      cityIndex,
    });
  }
  //注意如果这个地方不用箭头函数，则rowrenderer中的this为undefined****
  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源", 1, null, false);
    }
  }

  //通过解构的方式获得index这个参数，解构就是只要传过来的对象中有index这个属性，就能将其赋值给这个函数的参数
  getRowHeight = ({ index }) => {
    // console.log(index);
    // console.log("this1:", this);
    // return 100;
    const { cityList, cityIndex } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log("index:", index);
          // console.log("activei:", activeIndex);
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }

  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
    // console.log("active:", this.state.activeIndex);
  };

  render() {
    return (
      <div className="citylist">
        {/* <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)} //直接用go(-1)可以返回上一个页面，或者this.props.history.push("/home")
        >
          城市选择
        </NavBar> */}
        <NavHeader>城市选择</NavHeader>
        {/**城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/**右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
