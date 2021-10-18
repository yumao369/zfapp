import React from "react";
import FilterPicker from "../FilterPicker";
import FilterTitle from "../FilterTitle";
import styles from "./index.module.css";
import { API } from "../../../../utils/api";

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};

const selectedValues = {
  area: ["area", null],
  mode: ["null"],
  price: ["null"],
  more: [],
};

export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filtersData: {},
    selectedValues,
  };

  componentDidMount() {
    this.getFiltersData();
  }

  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await API.get(`/houses/condition?id=${value}`);
    // console.log(res);
    this.setState({
      filtersData: res.data.body,
    });
    // console.log(this.state.filtersData);
  }

  //注意this指向问题
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state;
    const newTitleSelectedStates = { ...titleSelectedStatus };
    Object.keys(titleSelectedStatus).forEach((item) => {
      if (item === type) {
        newTitleSelectedStates[type] = true;
        return;
      }
      const selectedVal = selectedValues[item];
      if (
        item === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStates[item] = true;
      } else if (item === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStates[item] = true;
      } else if (item === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStates[item] = true;
      } else {
        newTitleSelectedStates[item] = false;
      }
    });
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStates,
    });
    // console.log(type);
    // this.setState((prevState) => {
    //   //   console.log(prevState);
    //   return {
    //     titleSelectedStatus: {
    //       ...prevState.titleSelectedStatus,
    //       [type]: true,
    //     },
    //     openType: type,
    //   };
    // });
  };

  onCancel = () => {
    this.setState({
      openType: "",
    });
  };

  onSave = (type, value) => {
    // console.log(type, value);
    this.setState({
      openType: "",
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value,
      },
    });
  };

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state;
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    return (
      <FilterPicker
        // key值不同时，react会重新渲染组件
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }

  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}
        <div className={styles.content}>
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {this.renderFilterPicker()}
        </div>
      </div>
    );
  }
}
