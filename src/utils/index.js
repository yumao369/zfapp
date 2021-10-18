import axios from "axios";

export const MP = (ak) => {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=init`;
    document.head.appendChild(script);
    window.init = () => {
      resolve(window.BMap);
    };
  });
};

export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
  if (!localCity) {
    MP("dRsYjwYwSXWlasTrxA7OGSjkocvmvB8u").then((BMap) => {
      return new Promise((resolve, reject) => {
        const curCity = new BMap.LocalCity();
        curCity.get(async (res) => {
          try {
            // console.log("当前城市信息：", res);
            const result = await axios.get(
              `http://localhost:8009/area/info?name=${res.name}`
            );
            // console.log(result);
            localStorage.setItem("hkzf_city", JSON.stringify(result.data.body));
            resolve(result.data.body);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }
  return Promise.resolve(localCity);
};
