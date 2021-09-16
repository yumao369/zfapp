import React from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import axios from "axios";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.scss";

//导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent",
  },
];

/**轮播图经常遇到的问题：
 * 1、不会自动轮播
 * 2、从其他路由返回时，高度不够
 *
 * 原因：轮播图数据是动态加载的，加载完成前后轮播图数量不一致，所以会出现这个问题
 *
 * 解决：
 * 1、在state中添加表示轮播图加载完成的数据
 * 2、在轮播图数据加载完成时，修改该数据状态为true
 * 3、只有在轮播图数据加载完成的情况下，才渲染轮播图组件
 */
export default class Index extends React.Component {
  state = {
    //轮播图状态数据
    swipers: [],
    isSwiperLoaded: false,
    //租房小组数据
    groups: [],
    //最新资讯数据
    news: [],
  };

  //获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8009/home/swiper");
    this.setState(
      // () => {
      //   return {
      //     swipers: res.data.body,
      //   };
      // }
      {
        swipers: res.data.body,
        isSwiperLoaded: true,
      }
    );
  }

  //获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get("http://localhost:8009/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      groups: res.data.body,
    });
  }

  //获取最新资讯数据的方法
  async getNews() {
    const res = await axios.get("http://localhost:8009/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    // console.log(res);
    this.setState({
      news: res.data.body,
    });
  }

  //渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{
          display: "inline-block",
          width: "100%",
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8009${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }

  //渲染导航菜单
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }

  //渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8009${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8009${item.imgSrc}`} alt="" />
              </Flex>
            )}
          ></Grid>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank className="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
