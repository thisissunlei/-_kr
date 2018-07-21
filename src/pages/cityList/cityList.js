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
  choiceCity: function(event) {
    var that = this;
    console.log(event);
    var cityName = event.currentTarget.dataset.city.name;
    var cityId = event.currentTarget.dataset.city.id;
    console.log(that.data.cityList);
    that.data.cityList.map((item, index) => {
      console.log(item, index);
      item.flag = false;
      if (item.id == cityId) {
        var str = "cityList[index].flag";
        that.setData({
          str: true
        });
      }
      return item;
    });

    // console.log(cityName);

    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      cityName: cityName
    });

    wx.navigateBack();
  }
});
