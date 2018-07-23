//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    cityName: "北京",
    latitude: 0,
    longitude: 0,
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
        console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      }
    });
  },
  onReady: function(e) {
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
