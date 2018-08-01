//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    cityName: "北京市",
    cityId: 1,
    latitude: 0,
    longitude: 0,
    scale: 11,
    allCommunity: [],
    cityList: {},
    markers: []
  },
  //选择城市
  selectCity: function(e) {
    wx.navigateTo({
      url: "../cityList/cityList"
    });
  },
  onLoad: function() {
    var that = this;
    console.log(this.data.cityId);
    wx.getLocation({
      type: "gcj02",
      success: res => {
        // console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        that.getNearbyCity();
      }
    });
  },
  onShow: function() {
    // console.log(this.data.cityId);
    // this.getCitybyId();
  },
  //大厦城市id接口
  getCitybyId: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/cmts/city",
      data: {
        cityId: that.data.cityId,
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      success: function(res) {
        if (res.data.data.communityVOS.length > 0) {
          that.setData({
            latitude: res.data.data.cityLatitude,
            longitude: res.data.data.cityLongitude
          });
          // console.log(res);
          var cityById = Object.assign({}, res);
          console.log(cityById);
          let makeArr = [];
          let cityIdList = cityById.data.data.communityVOS;

          cityIdList.map((item, index) => {
            if (item.distance > 1000) {
              item.distance = (item.distance / 1000).toFixed(1) + "km";
            } else {
              item.distance = Math.round(item.distance * 10) / 10 + "m";
            }

            makeArr.push({
              iconPath: "../images/map/uncheck.png",
              id: item.communityId,
              latitude: item.latitude,
              longitude: item.longitude,
              // name: item.buildName,
              width: 27,
              height: 37
            });
            return item;
          });
          // console.log(makeArr);
          var str = "markers[" + 0 + "].iconPath";
          var strWidth = "markers[" + 0 + "].width";
          var strHeight = "markers[" + 0 + "].height";
          that.setData({
            allCommunity: cityIdList,
            cityList: cityIdList[0],
            markers: makeArr,
            [str]: "../images/map/mark.png",
            [strWidth]: 32,
            [strHeight]: 45
          });
          // that.setData({
          //   allCommunity: cityIdList,
          //   cityList: cityIdList[0],
          //   markers: makeArr
          // });
          console.log(that.data.markers);
        }

        //---------
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
        let makArr = [];
        var cityList = cityNearby.data.data.communityVOS;
        //排序
        cityList.sort(function(a, b) {
          return a.distance - b.distance;
        });
        cityList.map((item, index) => {
          if (item.distance > 1000) {
            item.distance = (item.distance / 1000).toFixed(1) + "km";
          } else {
            item.distance = Math.round(item.distance * 10) / 10 + "m";
          }
          makArr.push({
            iconPath: "../images/map/uncheck.png",
            id: item.communityId,
            latitude: item.latitude,
            longitude: item.longitude,
            // name: item.buildName,
            width: 27,
            height: 37
            // callout: {
            //   content: item.buildName,
            //   display: "BYCLICK"
            // }
          });

          return item;
        });
        console.log(cityList[0]);
        var str = "markers[" + 0 + "].iconPath";
        var strWidth = "markers[" + 0 + "].width";
        var strHeight = "markers[" + 0 + "].height";
        that.setData({
          allCommunity: cityList,
          cityList: cityList[0],
          markers: makArr,
          [str]: "../images/map/mark.png",
          [strWidth]: 32,
          [strHeight]: 45
        });
      }
    });
  },
  //点击card跳转大厦详情
  goBuildInfo: function(e) {
    // console.log(e.currentTarget.dataset.id);
    let communityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../boardroomList/boardroomList?communityId=${communityId}`
    });
  },
  //点击标记点
  changeCommunity: function(e) {
    console.log(e);
    var that = this;
    //点击标记切换card
    that.data.allCommunity.map((item, value) => {
      if (item.communityId == e.markerId) {
        that.setData({
          cityList: item
        });
      }
      return item;
    });
    let arr = [];
    //点击标记切换样式
    that.data.markers.map((item, index) => {
      item.iconPath = "../images/map/uncheck.png";
      item.width = 27;
      item.height = 37;
      if (item.id == e.markerId) {
        item.iconPath = "../images/map/mark.png";
        item.width = 32;
        item.height = 45;
      }
      arr.push(item);
      that.setData({
        markers: arr
      });
      return item;
    });
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("myMap");
    // this.getCenterLocation();
    this.moveToLocation();
  },
  // getCenterLocation: function() {
  //   this.mapCtx.getCenterLocation({
  //     success: function(res) {
  //       console.log(res.longitude);
  //       console.log(res.latitude);
  //     }
  //   });
  // },
  moveToLocation: function() {
    this.mapCtx.moveToLocation();
  }
  // translateMarker: function() {
  //   this.mapCtx.translateMarker({
  //     markerId: 1,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude: 39.93303,
  //       longitude: 116.47529
  //     },
  //     animationEnd() {
  //       console.log("animation end");
  //     }
  //   });
  // },
  // includePoints: function() {
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [
  //       {
  //         latitude: 23.10229,
  //         longitude: 113.3345211
  //       },
  //       {
  //         latitude: 23.00229,
  //         longitude: 113.3345211
  //       }
  //     ]
  //   });
  // }
});
