//获取应用实例
const app = getApp();

Page({
  data: {
    value: 0,
    cityList: []
  },
  onLoad: function() {
    this.getCityList();
  },
  choiceCity: function(event) {
    // console.log(event);
    var that = this;
    that.setData({
      value: event.currentTarget.dataset.city.cityId
    });
    var cityId = event.currentTarget.dataset.city.cityId;
    var cityName = event.currentTarget.dataset.city.cityName;
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      cityName: cityName,
      cityId: cityId
    });
    prevPage.getCitybyId();

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },
  //城市列表接口
  getCityList: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/citys",
      success: function(res) {
        let cityList = Object.assign({}, res);
        console.log(cityList, "城市列表");
        let cityArr = [];
        cityList.data.data.map((item, index) => {
          cityArr.push(item);
          return item;
        });
        that.setData({
          cityList: cityArr
        });
        // console.log(that.data.cityList);
      }
    });
  }
});
