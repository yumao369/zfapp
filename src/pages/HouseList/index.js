import { Flex } from "antd-mobile";
import React from "react";
import SearchHeader from "../../components/searchHeader";
import Filter from "./components/Filter";
import styles from "./index.module.css";

const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends React.Component {
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>
        <Filter />
        {/**条件筛选 */}
      </div>
    );
  }
}
