//index.js
//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function(res) {
    // wx.reportAnalytics("sharekrmeeting");
    // console.log(res);
    return {
      title: "开启轻松、灵活办公新方式",
      desc: "氪空间自由座",
      path: "pages/index/index",
      imageUrl: "../images/share_pic.jpg"
    };
  },
  data: {
    indicatorDots: false,
    autoplbuildAddressay: true,
    interval: 5000,
    duration: 1000,
    btn_bool: true,
    duration: 1000,
    buildingList: [], //周边大厦
    myMeeting: [], //会议、散座、活动轮播
    noOpenBuilding: [], //未开放大厦
    preIndex: 0,
    activityList: [], //活动轮播
    activity: {
      //活动轮播参数
      current: 0,
      duration: 500,
      previousMargin: "26rpx",
      nextMargin: "26rpx",
      circular: false
    }
  },
  rq_data: {
    latitude: "",
    longitude: ""
  },
  func_bool_g: false,
  func_bool_l: false,
  func_bool_l2: false,
  func_bool_s: false,
  //活动轮播变化
  acitvityChange: function(e) {
    // console.log(e.detail);

    if (e.detail.source == "touch") {
      this.setData({
        preIndex: e.detail.current
      });
    }
  },
  //活动详情页
  goActivityDetail: function(e) {
    // console.log(e.currentTarget.dataset.id);
    let activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityDetails/activity?activityId=" + activityId
    });
  },
  //打开地图
  openmap: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        // console.log(res);
        if (res.authSetting["scope.userLocation"]) {
          wx.navigateTo({
            url: "../map/map"
          });
        } else {
          wx.showModal({
            title: "温馨提示",
            content:
              "您没有授权地理信息或者没有开启定位，无法使用我们的地图功能~",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                that.getLocation();
              }
            }
          });
        }
      }
    });
  },
  //获取地理位置
  getLocation: function() {
    var _this = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        // console.log(res);
        _this.rq_data = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        wx.setStorage({
          key: "lat_log",
          data: {
            lat_log: {
              latitude: res.latitude,
              longitude: res.longitude
            }
          }
        });
        _this.func_bool_g = true;
        if (_this.func_bool_g && _this.func_bool_l) {
          _this.func_bool_g = false;
          _this.func_bool_l = false;
          _this.getAllInfo();
        }
      },
      fail: function(res) {
        // _this.getAllInfo();
      }
    });
  },
  getURLParam: function(deal_url, paramName) {
    var paramValue = "";
    var isFound = false;
    deal_url = decodeURIComponent(deal_url)
      .substring(1, deal_url.length)
      .split("?")[1];
    if (deal_url.indexOf("=") > 1) {
      let arrSource = deal_url.split("&");
      let i = 0;
      while (i < arrSource.length && !isFound) {
        if (arrSource[i].indexOf("=") > 0) {
          if (
            arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()
          ) {
            paramValue = arrSource[i].split("=")[1];
            isFound = true;
          }
        }
        i++;
      }
    }

    return paramValue;
  },
  onLoad: function(options) {
    const that = this;
    // console.log(options);
    if (options.q) {
      const channelname_v = that.getURLParam(options.q, "id");
      wx.reportAnalytics("idx_channel", {
        channelname: channelname_v
      });
      // console.log(channelname_v, 11111);
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    this.getLocation();
    //页面加载
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            data: {
              code: res.code
            },
            success: function(res) {
              wx.hideLoading();
              that.func_bool_l = true;
              that.func_bool_l2 = true;
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getActivity();
              if (that.func_bool_g && that.func_bool_l) {
                that.func_bool_g = false;
                that.func_bool_l = false;
                that.getAllInfo();
                that.getInfo();
              }
              if (that.func_bool_l2 && that.func_bool_s) {
                that.func_bool_s = false;
                that.func_bool_l2 = false;
                that.getAllInfo();
                that.getInfo();
              }
            }
          });
        } else {
          // console.log("登录失败！" + res.errMsg);
        }
      }
    });

    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          // console.log("用户没有授权：用户信息！");
        } else {
          that.func_bool_s = true;
          if (that.func_bool_s && that.func_bool_l2) {
            that.func_bool_s = false;
            that.func_bool_l2 = false;

            that.getInfo();
          }

          that.setData({ btn_bool: false });
        }
      }
    });
  },
  onShow: function() {
    this.getAllInfo();
    this.getActivity();
  },
  //首页活动接口
  getActivity: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmactivity/home/list",
      success: res => {
        var activityList = Object.assign({}, res);
        // console.log(activityList, "活动列表");
        that.setData({
          activityList: activityList.data.data
        });
        // console.log(that.data.activityList);
      }
    });
  },
  //首页接口
  getAllInfo: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/home",
      data: {
        latitude: that.rq_data.latitude,
        longitude: that.rq_data.longitude
      },
      success: res => {
        if (res.data.code == 1) {
          var mansion = Object.assign({}, res);
          console.log(mansion, "列表");
          var buildingList = mansion.data.data.buildingList;

          var myMeeting = mansion.data.data.myTodo.slice(0, 5);

          myMeeting.map(value => {
            // console.log(value.todoTime.split("#")[0]);
            if (value.targetType == "ACTIVITY") {
              value.before = value.todoTime.split("#")[0];
              value.last = value.todoTime.split("#")[1];
            }
            return value;
          });
          // console.log(myMeeting);

          //排序
          buildingList.sort(function(a, b) {
            return a.distance - b.distance;
          });
          //未开放大厦
          let noOpenBuilding = buildingList.filter((item, index) => {
            if (item.published) {
              return false;
            }
            return true;
          });

          //开放大厦
          let newBuildingList = buildingList.filter((item, index) => {
            if (item.published) {
              if (item.distance > 1000) {
                item.distance = (item.distance / 1000).toFixed(1) + "km";
              } else {
                item.distance = Math.round(item.distance * 10) / 10 + "m";
              }
              return true;
            }
            return false;
          });
          that.setData({
            buildingList: newBuildingList || [],
            myMeeting: myMeeting || [],
            noOpenBuilding: noOpenBuilding || []
          });
          // console.log(myMeeting.length);
          //如果只有一张card 不显示小圆点
          if (myMeeting.length > 1) {
            that.setData({
              indicatorDots: true
            });
          }
        }
      }
    });
    //白屏问题代码-------
    // if (that.data.myMeeting.length == 0) {
    //   that.setData({
    //     metting: false
    //   });
    // } else if (that.data.myMeeting.length == 1) {
    //   that.setData({
    //     metting: true,
    //     indicatorDots: false
    //     noSwiper: true,
    //     swiper: false
    //   });
    // } else {
    //   that.setData({
    //     metting: true
    //     noSwiper: false,
    //     swiper: true
    //   });
    // }
    //-------白屏问题代码
    // console.log(that.data.metting);
    //   }
    // });
  },
  //获取用户信息
  getInfo: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl
        });
        //保存到storage里
        wx.setStorage({
          key: "user_info",
          data: {
            user_info: res.userInfo
          }
        });
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/krmting/user/save",

          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: res => {}
        });
      }
    });
  },
  //跳转新人指导
  point: function() {
    wx.reportAnalytics("viewguide");
    wx.navigateTo({
      url: "../point/point"
    });
  },
  //点击会议card
  moveToMeetingDetail: function(e) {
    // console.log(e);
    var inviteeId = e.currentTarget.dataset.id;
    // wx.reportAnalytics('goodsdetails')

    wx.navigateTo({
      url: "../meetingDetail/meetingDetail?inviteeId=" + inviteeId
    });
  },
  //点击散座card
  moveToSeatDetail: res => {
    // console.log(res);
    var seatId = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../seatDetail/seatDetail?seatId=" + seatId
    });
  },
  //点击活动card
  moveToActivity: res => {
    // console.log(res);
    var targetId = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityQuickMark/activityQuickMark?joinId=" + targetId
    });
  },
  // jumpToMeetingDetail: function() {
  //   var inviteeId = this.data.myMeeting[0].id;
  //   wx.navigateTo({
  //     url: "../meetingDetail/meetingDetail?inviteeId=" + inviteeId
  //   });
  // },
  //点击周边大厦
  moveToMeetingRoom: function(e) {
    wx.reportAnalytics("viewcommunity");
    var communityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../boardroomList/boardroomList?communityId=" + communityId
    });
  },
  //我的
  moveToMy: function() {
    wx.reportAnalytics("viewusercenter");
    wx.navigateTo({
      url: "../my/my"
    });
  },
  //授权
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        btn_bool: false
      });
    }
  },
  jumpMyMeet: function() {
    wx.navigateTo({
      url: "../bindPhone/bindPhone?from=seat"
    });
  }
});
