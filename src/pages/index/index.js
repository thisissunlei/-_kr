//index.js
//获取应用实例
const app = getApp();
Page({
  moveToBind: function() {
    wx.navigateTo({
      url: "../bindPhone/bindPhone"
    });
  },
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
    // avatarUrl: "",
    userInfo: {},
    distanceShow: false, //距离显示
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
    },
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    //--------------------------
    alertOnce: false, //第一次
    showCoupon: false, //提取礼券弹窗
    showDiscounts: false, //今日特惠
    discounts: [], //今日特惠
    extractList: [], //可提取礼券列表
    activityFlag: false
  },
  newFish: true,
  rq_data: {
    latitude: "",
    longitude: ""
  },
  toView: "",
  func_bool_g: false,
  func_bool_l: false,
  func_bool_l2: false,
  func_bool_s: false,
  //打开今天特惠
  changeDiscounts: function() {
    this.setData({
      showDiscounts: !this.data.showDiscounts
    });
  },
  formSubmit: function(e) {
    const that = this;
    console.log(e);
    let formId = e.detail.formId;
    // console.log("form发生了submit事件，推送码为：", formId);
    that.submintFromId(formId);
  },
  //提交formId，让服务器保存到数据库里
  submintFromId: function(formId) {
    var that = this;
    // console.log(formId);
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmboostermsg/collect-formId",
      data: {
        formId: formId
      },
      success: res => {
        console.log(res);
        that.jumpHelpingActivity();
      }
    });
  },

  //首次弹窗关闭
  alertClosed: function() {
    this.setData({
      alertOnce: false
    });
  },
  //提取礼券弹窗关闭
  changeCoupon: function() {
    this.setData({
      showCoupon: false
    });
  },
  //跳转助力活动详情页
  jumpHelpingActivity: function() {
    wx.navigateTo({
      url: "../createImg/createImg"
    });
    this.setData({
      alertOnce: false,
      showCoupon: false
    });
  },
  //活动轮播变化
  acitvityChange: function(e) {
    if (e.detail.source == "touch") {
      this.setData({
        preIndex: e.detail.current
      });
    }
  },
  //活动详情页
  goActivityDetail: function(e) {
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
    if (options.fromPage == "inside") {
      that.toView = "list";
    }
    if (options.fromPage == "guide") {
      that.newFish = false;
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    //获取地理位置
    this.getLocation();
    //登陆
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
              // that.getActivity();
              that.getDiscounts();
              that.getOnecVisit();
              that.getShowCoupon();
              that.getActivityFlag();
              if (that.func_bool_g && that.func_bool_l) {
                that.func_bool_g = false;
                that.func_bool_l = false;
                that.getAllInfo();
                // that.getInfo();
              }
              if (that.func_bool_l2 && that.func_bool_s) {
                that.func_bool_s = false;
                that.func_bool_l2 = false;
                that.getAllInfo();
                // that.getInfo();
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
          if (that.newFish) {
            wx.reLaunch({
              url: "../laymanGuide/laymanGuide"
            });
          }
        } else {
          that.func_bool_s = true;
          if (that.func_bool_s && that.func_bool_l2) {
            that.func_bool_s = false;
            that.func_bool_l2 = false;

            // that.getInfo();
          }

          that.setData({ btn_bool: false });
        }
      }
    });
  },
  onReady: function() {
    var that = this;

    wx.getStorage({
      key: "user_info",
      // data: {
      //   user_info: e.detail.userInfo
      // }
      success: res => {
        // console.log(res);
        that.setData({
          userInfo: res.data.user_info
        });
      }
    });
    setTimeout(() => {
      that.setData({
        toView: that.toView
      });
    }, 500);
  },
  onShow: function() {
    this.getAllInfo();
    //活动入口
    // this.getActivity();
  },
  //活动是否结束
  getActivityFlag: function() {
    let that = this;
    // 判断活动是否结束
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/ovedue",
      method: "GET",
      data: {
        activityId: 1
      },
      success: res => {
        console.log("活动是否过期", res);
        if (res.data.data) {
          that.setData({
            activityFlag: true
          });
        }
      }
    });
  },
  //是否首次接口
  getOnecVisit: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/first-page",
      success: res => {
        // console.log(res);
        if (res.data.data) {
          that.setData({
            alertOnce: true
          });
        }
      }
    });
  },
  //今天特惠接口
  getDiscounts: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/today-special",
      success: res => {
        // console.log(res);
        that.setData({
          discounts: res.data.data
        });
      }
    });
  },
  //可领取礼券接口 kmbooster/show-coupon
  getShowCoupon: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/show-coupon",
      success: res => {
        console.log(res);
        if (res.data.data.length > 0) {
          that.setData({
            extractList: res.data.data,
            showCoupon: true
          });
        }
      }
    });
  },
  // 首页活动接口
  getActivity: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmactivity/home/list",
      success: res => {
        var activityList = Object.assign({}, res);
        that.setData({
          activityList: activityList.data.data
        });
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
          // console.log(mansion, "列表");
          var buildingList = mansion.data.data.buildingList;
          var myMeeting = mansion.data.data.myTodo.slice(0, 5);
          //未授权地理信息不显示距离
          let resture = buildingList.some(value => {
            return value.distance == 0;
          });
          if (resture) {
            that.setData({
              distanceShow: false
            });
          } else {
            that.setData({
              distanceShow: true
            });
          }
          //活动时间分割
          myMeeting.map(value => {
            if (value.targetType == "ACTIVITY") {
              if (value.todoTime.includes("至")) {
                // console.log(1);
                value.before = value.todoTime.split("#")[0];
                value.last = value.todoTime.split("#")[1];
                value.single = false;
              } else {
                value.before = value.todoTime.split("#")[0];
                value.last = value.todoTime.split("#")[1];
                value.single = true;
              }
            }
            return value;
          });

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
        console.log(res);
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
      url: "../point/point?fromIndex=true"
    });
  },
  jumpToTeamCard: function() {
    wx.navigateTo({
      url: "../teamCardPurchase/teamCardPurchase"
    });
  },
  //点击会议card
  moveToMeetingDetail: function(e) {
    // console.log(e);
    var inviteeId = e.currentTarget.dataset.id;
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
    // console.log(e);
    const that = this;

    if (e.detail.userInfo) {
      // this.getInfo();
      that.setData({
        // avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      });
      wx.setStorage({
        key: "user_info",
        data: {
          user_info: e.detail.userInfo
        }
      });
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/krmting/user/save",

        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: res => {}
      });
      that.setData({
        btn_bool: false
      });
    }
  }
});
