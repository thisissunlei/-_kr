//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    cityName: "北京市",
    latitude: 0,
    longitude: 0,
    cityList: {},
    // markers: [
    //   {
    //     id: 1,
    //     latitude: 23.099994,
    //     longitude: 113.32452,
    //     name: "T.I.T 创意园"
    //   }
    // ]
    markers: [
      {
        iconPath: "../images/public/icon_dizhi.png",
        id: 0,
        latitude: 39.9219,
        longitude: 116.44355,
        name: "放假",
        width: 25,
        height: 40
      }
    ]
  },
  //选择城市
  selectCity: function(e) {
    wx.navigateTo({
      url: "../cityList/cityList"
    });
  },
  onLoad: function() {
    var that = this;
    wx.getLocation({
      success: res => {
        // console.log(typeof res.latitude);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        this.getNearbyCity();
        // this.getCitybyId();
        // console.log(that.data.latitude);
      }
    });
    // console.log(that.data.latitude)
  },
  getCitybyId: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + " api/gateway/krmting/cmts/city",
      data: {
        cityId: 1,
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      success: function(res) {
        console.log(res);
      }
    });
  },
  //附近的大厦接口
  getNearbyCity: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/cmts/nearby",
      data: {
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      success: function(res) {
        console.log(res);
        var cityNearby = Object.assign({}, res);
        var cityList = cityNearby.data.data;
        //排序
        cityList.sort(function(a, b) {
          return a.distance - b.distance;
        });
        cityList.map((item, index) => {
          if (item.distance > 1000) {
            item.distance = (item.distance / 1000).toFixed() + "km";
          } else {
            item.distance = Math.round(item.distance * 10) / 10 + "m";
          }
          return item;
        });
        // console.log(cityList);
        that.setData({
          cityList: cityList[0]
        });
        // console.log(that.data.cityList);
      }
    });
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("myMap");
    // this.getCenterLocation();
    this.moveToLocation();
  },
  getCenterLocation: function() {
    this.mapCtx.getCenterLocation({
      success: function(res) {
        console.log(res.longitude);
        console.log(res.latitude);
      }
    });
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation();
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211
      },
      animationEnd() {
        console.log("animation end");
      }
    });
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [
        {
          latitude: 23.10229,
          longitude: 113.3345211
        },
        {
          latitude: 23.00229,
          longitude: 113.3345211
        }
      ]
    });
  }

  // onReady: function(options) {
  //   console.log("onLoad");
  //   console.log(options);
  //   this.mapCtx = wx.createMapContext("myMap");

  //   var that = this;
  //   wx.getLocation({
  //     success: res => {
  //       // console.log(res);
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       });
  //     }
  //   });
  //   // this.getCenterLocation();
  //   this.moveToLocation();
  // },
  // getCenterLocation: function() {
  //   //   console.log(this.data)
  //   var that = this;
  //   that.mapCtx.getCenterLocation({
  //     success: function(res) {
  //       console.log(that.data);
  //       console.log(res);

  //     }
  //   });
  // },
  // moveToLocation: function() {
  //   this.mapCtx.moveToLocation();
  // }
});
