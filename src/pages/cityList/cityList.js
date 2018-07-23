//获取应用实例
const app = getApp();

Page({
  data: {
    value: 0,
    cityList: [
      { id: 1, name: "北京市" },
      { id: 2, name: "上海市" },
      { id: 3, name: "杭州市" },
      { id: 4, name: "苏州市" },
      { id: 5, name: "西安市" },
      { id: 6, name: "广州市" },
      { id: 7, name: "深圳市" },
      { id: 8, name: "乌鲁木齐市" }
    ]
  },
  choiceCity: function(event) {
    var that = this;
    that.setData({
      value: event.currentTarget.dataset.city.id
    });
    var cityName = event.currentTarget.dataset.city.name;
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      cityName: cityName
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
