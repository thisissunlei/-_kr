//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.32452,
    markers: [
      {
        id: 1,
        latitude: 23.099994,
        longitude: 113.32452,
        name: "T.I.T 创意园"
      }
    ]
  },
  //选择城市
  selectCity: function() {
    wx.navigateTo({
      url: "../city/city"
    });
  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext("myMap");
    this.getCenterLocation();
    this.moveToLocation();
    // var that = this;
    // wx.request({
    //   url: app.globalData.KrUrl + "api/gateway/krmting/home",
    //   data: {
    //     latitude: that.data.latitude,
    //     longitude: that.data.longitude
    //   },
    //   success: function(res) {
    //     console.log(res);
    //   }
    // });
  },
  getCenterLocation: function() {
    //   console.log(this.data)
    this.mapCtx.getCenterLocation({
      success: function(res) {
        console.log(res.longitude);
        console.log(res.latitude);
      }
    });
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation();
  }
  //   translateMarker: function() {
  //     this.mapCtx.translateMarker({
  //       markerId: 1,
  //       autoRotate: true,
  //       duration: 1000,
  //       destination: {
  //         latitude: 23.10229,
  //         longitude: 113.3345211
  //       },
  //       animationEnd() {
  //         console.log("animation end");
  //       }
  //     });
  //   }
  //   includePoints: function() {
  //     this.mapCtx.includePoints({
  //       padding: [10],
  //       points: [
  //         {
  //           latitude: 23.10229,
  //           longitude: 113.3345211
  //         },
  //         {
  //           latitude: 23.00229,
  //           longitude: 113.3345211
  //         }
  //       ]
  //     });
  //   }
});
