import React from "react";
import { Link } from "react-router-dom";
import NavHeader from "../../components/NavHeader";
// import "./index.scss";
import styles from "./index.module.css";
import { MP } from "../../utils";
// import axios from "axios";
import { Toast } from "antd-mobile";
import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";

const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};

//放大地图也是哟个centerandzoom，只要设置一个更大的级别就行
export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowList: false,
  };
  componentDidMount() {
    this.initMap();
  }
  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
    // console.log(label, value);

    MP("dRsYjwYwSXWlasTrxA7OGSjkocvmvB8u").then((BMap) => {
      this.BMap = BMap;
      var map = new BMap.Map("container"); // 创建Map实例
      //var point = new BMap.Point(116.404, 39.915); // 创建点坐标
      this.map = map;
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上，并调整地图视野
      myGeo.getPoint(
        label,
        async (point) => {
          if (point) {
            map.centerAndZoom(point, 11);
            // map.addOverlay(new BMap.Marker(point));
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            this.renderOverlays(value);
            // const res = await axios.get(
            //   `http://localhost:8009/area/map?id=${value}`
            // );
            // // console.log("房源数据：", res);
            // res.data.body.forEach((item) => {
            //   //第一个是两层解构，第二个是对解构出来的label进行重命名，因为我们在前面定义过label了
            //   const {
            //     coord: { longitude, latitude },
            //     label: areaName,
            //     count,
            //     value,
            //   } = item;
            //   const areaPoint = new BMap.Point(longitude, latitude);
            //   var opts = {
            //     position: areaPoint, // 指定文本标注所在的地理位置
            //     offset: new BMap.Size(-35, -35), // 设置文本偏移量
            //   };
            //   // 创建文本标注对象
            //   var label = new BMap.Label("", opts);
            //   label.id = value;
            //   // 自定义文本标注样式
            //   label.setContent(`
            //           <div class="${styles.bubble}">
            //            <p class="${styles.name}">${areaName}</p>
            //            <p>${count}套</p>
            //           </div>
            //   `);
            //   label.setStyle(labelStyle);
            //   label.addEventListener("click", () => {
            //     // console.log("点击:", label.id);
            //     map.centerAndZoom(areaPoint, 13);
            //     //解决清楚覆盖物时，百度地图API的js文件自身报错的问题
            //     setTimeout(() => {
            //       map.clearOverlays();
            //     }, 0);
            //   });
            //   map.addOverlay(label);
            // });
          }
        },
        label
      );

      map.addEventListener("movestart", () => {
        if (this.state.isShowList) {
          this.setState({
            isShowList: false,
          });
        }
      });

      // map.centerAndZoom(point, 15);
      // map.enableScrollWheelZoom(); //启用滚轮放大缩小
    });
  }
  //   componentDidMount() {
  //     const map = new window.BMap.Map("container");
  //     const point = new window.BMap.Point(116.404, 39.915);
  //     map.centerAndZoom(point, 15);
  //   }

  async renderOverlays(id) {
    try {
      Toast.loading("加载中...", 0, null, false);
      const res = await API.get(`/area/map?id=${id}`);
      Toast.hide();
      const data = res.data.body;
      const { nextZoom, type } = this.getTypeAndZoom();
      data.forEach((item) => {
        this.createOverlays(item, nextZoom, type);
      });
    } catch (e) {
      Toast.hide();
    }
  }

  getTypeAndZoom() {
    const zoom = this.map.getZoom();
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 16) {
      type = "rect";
    }
    return {
      nextZoom,
      type,
    };
  }

  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data;
    const areaPoint = new this.BMap.Point(longitude, latitude);
    if (type === "circle") {
      this.createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      this.createRect(areaPoint, areaName, count, value);
    }
  }

  createCircle(point, name, count, id, zoom) {
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(-35, -35), // 设置文本偏移量
    };
    // 创建文本标注对象
    var label = new this.BMap.Label("", opts);
    label.id = id;
    // 自定义文本标注样式
    label.setContent(`
            <div class="${styles.bubble}">
             <p class="${styles.name}">${name}</p>
             <p>${count}套</p>
            </div>
    `);
    label.setStyle(labelStyle);
    label.addEventListener("click", () => {
      this.renderOverlays(id);
      // console.log("点击:", label.id);
      this.map.centerAndZoom(point, zoom);
      //解决清楚覆盖物时，百度地图API的js文件自身报错的问题
      setTimeout(() => {
        this.map.clearOverlays();
      }, 0);
    });
    this.map.addOverlay(label);
  }

  createRect(point, name, count, id) {
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(-50, -28), // 设置文本偏移量
    };
    // 创建文本标注对象
    var label = new this.BMap.Label("", opts);
    label.id = id;
    // 自定义文本标注样式
    label.setContent(`
            <div class="${styles.rect}">
             <p class="${styles.housename}">${name}</p>
             <span class="${styles.housenum}">${count}套</span>
             <i class="${styles.arrow}"></i>
            </div>
    `);
    label.setStyle(labelStyle);
    label.addEventListener("click", (e) => {
      this.getHouseList(id);
      // console.log("点击");
      const target = e.changedTouches[0];
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 300) / 2 - target.clientY
      );
    });
    this.map.addOverlay(label);
  }

  async getHouseList(id) {
    try {
      Toast.loading("加载中...", 0, null, false);
      const res = await API.get(`/houses?cityId=${id}`);
      Toast.hide();
      // console.log("小区：", res);
      this.setState({
        houseList: res.data.body.list,
        isShowList: true,
      });
    } catch (e) {
      Toast.hide();
    }
  }

  renderHousesList() {
    return this.state.houseList.map((item) => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={BASE_URL + item.houseImg} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const tagClass = "tag" + (index + 1);
              return (
                <span
                  className={[styles.tag, styles[tagClass]].join(" ")}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className={styles.map}>
        {/**顶部导航栏组件 */}
        {/**方式一：给NavHeader添加title属性，通过props传值的方式传递 */}
        {/* <NavHeader title="地图找房"/> */}
        {/**方式二：通过下面这种方法，通过组件的children属性传值，更加直观，就如同<div>标签直接包裹内容 */}
        <NavHeader>地图找房</NavHeader>
        {/*地图容器元素*/}
        <div id="container" className={styles.container} />
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              房屋列表
            </Link>
          </div>
          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}
