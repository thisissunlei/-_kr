//获取应用实例
const app = getApp();

Page({
  data: {
    cityList: [
      { id: 1, name: "北京", flag: true },
      { id: 2, name: "上海", flag: false },
      { id: 3, name: "杭州", flag: false },
      { id: 4, name: "苏州", flag: false }
    ]
  },
  choiceCity: function(e) {
    console.log(e);
  }
});
