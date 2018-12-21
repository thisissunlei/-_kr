//index.js
//获取应用实例
const app = getApp();
var QR = require("../../utils/qrcode.js");
const scanCode = require("../../utils/scanCode");
Page({
  onShareAppMessage: function(res) {
    wx.reportAnalytics("sharekrmeeting");
    return {
      title: "开启轻松、灵活办公新方式",
      desc: "氪空间自由座",
      path: "pages/index/index",
      imageUrl: app.globalData.KrImgUrl+"share_pic.jpg"
    };
  },
  data: {
    indicatorDots: false,
    autoplbuildAddressay: true,
    interval: 5000,
    duration: 1000,
    btn_bool: true,
    avatarUrl: "",
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
    alertOnce: false, //第一次
    showCoupon: false, //提取礼券弹窗
    showDiscounts: false, //今日特惠
    discounts: [], //今日特惠
    extractList: [], //可提取礼券列表
    activityFlag: false,
    pickerArray: [], //城市选择器
    objectPickerArray: [], //城市社区详情
    pickerIndex: 0,
    qrDialog: false,
    seatId: 1,
    currentTodo: 0,
    todoAuto: true,
    phoneDialog: false,
    passwordDialog: false,
    password: ''
  },
  newFish: true, //首次进入小程序
  cityId: 0,
  rq_data: {
    latitude: "",
    longitude: ""
  },
  toView: "",
  loginStatus: false, //登录状态
  authorStatus: false, //授权状态
  locationStatus: false, //地理信息状态
  //城市选择器
  bindPickerChange: function(e) {
    const that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    that.cityId = this.data.objectPickerArray[e.detail.value].cityId;
    that.getCitybyId();
    that.setData({
      pickerIndex: e.detail.value
    });
  },
  //打开今天特惠
  changeDiscounts: function() {
    this.setData({
      showDiscounts: !this.data.showDiscounts
    });
  },
  //提交formId，让服务器保存到数据库里
  formSubmit: function(e) {
    const that = this;
    let formId = e.detail.formId;
    that.submintFromId(formId);
  },
  /**
   *
   * @param {string} formId 用于发送模板消息
   */
  submintFromId: function(formId) {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmboostermsg/collect-formId",
      data: {
        formId: formId
      },
      success: res => {
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
  todoChange(e) {
    this.setData({
      currentTodo: e.detail.current
    });
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
    let that = this;
    wx.getSetting({
      success: function(res) {
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
    let _this = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
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
        _this.locationStatus = true;
        // _this.getCitybyId()
      },
      fail: function(res) {}
    });
  },
  getURLParam: function(deal_url, paramName) {
    let paramValue = "";
    let isFound = false;
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
    }
    //内部礼券页面进入首页
    if (options.fromPage == "inside") {
      that.toView = "list";
    }
    //新人引导页进入首页
    if (options.fromPage == "guide") {
      that.newFish = false;
    }

    // 首页小程序码渠道统计
    if (options.id) {
      wx.reportAnalytics("idx_channel", {
        channelname: options.id
      });
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
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            data: {
              code: res.code
            },
            success: function(res) {
              wx.hideLoading();

              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getInfo();
              that.getCityList();
              that.getCitybyId();
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
          that.authorStatus = true;
          that.setData({
            btn_bool: false
          });
        }
      }
    });
  },
  onReady: function() {
    let that = this;
    //从内部礼券页面进入首页滑动至锚点
    setTimeout(() => {
      that.setData({
        toView: that.toView
      });
    }, 500);
  },
  onShow: function() {
    const that = this;
    if (that.loginStatus && that.authorStatus) {
      that.getAllInfo();
    }
    if (that.locationStatus && that.loginStatus) {
      that.getCitybyId(false);
    }
    //活动入口
    // this.getActivity();
  },

  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  readyQR: function() {
    // if (this.data.seatStatus == "EXPIRED" || this.data.seatStatus == "USED") {
    //   QR.qrApi.draw(
    //       "https://web.krspace.cn/kr-meeting/kr_seat/index.html?inviteeId=" +
    //       th.data.seatId,
    //       "mycanvas",
    //       160,
    //       160,
    //       null,
    //       "rgba(0,0,0,0.3)"
    //   );
    //   this.setData({ canInvite: false });
    //   // console.log(that.data.canInvite);
    // } else {
    //   QR.qrApi.draw(
    //       "https://web.krspace.cn/kr-meeting/kr_seat/index.html?inviteeId=" +
    //       this.data.seatId,
    //       "mycanvas",
    //       160,
    //       160
    //   );
    // }
  },
  //城市列表接口
  getCityList: function() {
    let that = this;
    let newCityList = ["全部城市"];
    let newCityDetail = [
      {
        cityId: 0,
        cityName: "全部城市"
      }
    ];
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/citys",
      success: function(res) {
        let cityList = Object.assign({}, res);
        let cityListName = cityList.data.data;

        cityListName.map(value => {
          newCityList.push(value.cityName);
          newCityDetail.push(value);
        });
        that.setData({
          objectPickerArray: newCityDetail,
          pickerArray: newCityList
        });
      }
    });
  },
  //大厦城市id接口
  getCitybyId: function(hide = true) {
    let that = this;
    app.getRequest({
      url:
        app.globalData.KrUrl + "api/gateway/krmting/room/find-cmts-by-cityid",
      data: {
        cityId: that.cityId,
        latitude: that.rq_data.latitude,
        longitude: that.rq_data.longitude
      },
      success: function(res) {
        if (hide) {
          wx.hideLoading();
        }
        let cityById = Object.assign({}, res);
        let buildingList = cityById.data.data;
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
        //排序
        buildingList.sort(function(a, b) {
          return a.distance - b.distance;
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
        //未开放大厦
        let noOpenBuilding = buildingList.filter((item, index) => {
          if (item.published) {
            return false;
          }
          return true;
        });
        that.setData({
          buildingList: newBuildingList || [],
          noOpenBuilding: noOpenBuilding || []
        });
      }
    });
  },
  //活动是否结束
  getActivityFlag: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/ovedue",
      method: "GET",
      data: {
        activityId: 1
      },
      success: res => {
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
        that.setData({
          discounts: res.data.data
        });
      }
    });
  },
  //可领取礼券接口
  getShowCoupon: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/show-coupon",
      success: res => {
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
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/home",
      data: {
        latitude: that.rq_data.latitude,
        longitude: that.rq_data.longitude
      },
      success: res => {
        if (res.data.code > 0) {
          let mansion = Object.assign({}, res);
          let myMeeting = mansion.data.data.myTodo.slice(0, 5);

          //活动时间分割
          myMeeting.map(value => {
            if (value.targetType == "ACTIVITY") {
              if (value.todoTime.includes("至")) {
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

          that.setData({
            myMeeting: myMeeting || []
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
  },
  //获取用户信息
  getInfo: function() {
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl
        });
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
          success: function(res) {
            that.loginStatus = true;

            that.getAllInfo();
            that.getDiscounts();
            that.getOnecVisit();
            // that.getShowCoupon();
            that.getActivityFlag();
            that.getCityList();
            that.getCitybyId();
          }
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
  //跳转团队卡页面
  jumpToTeamCard: function() {
    wx.navigateTo({
      url: "../teamCardPurchase/teamCardPurchase"
    });
  },
  //点击会议card
  moveToMeetingDetail: function(e) {
    let inviteeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../meetingDetail/meetingDetail?inviteeId=" + inviteeId
    });
  },
  //点击散座card
  moveToSeatDetail: res => {
    let seatId = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../seatDetail/seatDetail?seatId=" + seatId
    });
  },
  //点击活动card
  moveToActivity: res => {
    let targetId = res.currentTarget.dataset.id;
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
    const that = this;

    if (e.detail.userInfo) {
      that.getInfo();
      that.setData({
        btn_bool: false
      });
    }
  },

  closeDialog() {
    this.setData({
      qrDialog: false,
      todoAuto: true,
      phoneDialog: false,
      passwordDialog: false
    })
  },

  scanCode() {
    if (this.data.myMeeting[this.data.currentTodo].targetType === 'MEETING' || this.data.myMeeting[this.data.currentTodo].targetType === 'SEAT') {
      scanCode.scanCode(this.data.myMeeting[this.data.currentTodo].targetType, this.data.myMeeting[this.data.currentTodo].targetId, this);
    }
  },

  scaleCode() {
    console.log('currentTodo', this.data.currentTodo)
    console.log('currentId', this.data.myMeeting[this.data.currentTodo].targetId)
    this.setData({
      qrDialog: true,
      todoAuto: false
    }, () => {
      let typeUrl = "kr_seat";
      if (this.data.myMeeting[this.data.currentTodo].targetType === 'MEETING') {
        typeUrl = 'kr_meeting_h5';
      } else if (this.data.myMeeting[this.data.currentTodo].targetType === 'ACTIVITY') {
        typeUrl = 'kr_meeting_activity';
      }
      QR.qrApi.draw(
          "https://web.krspace.cn/kr-meeting/" + typeUrl + "/index.html?inviteeId=" + this.data.myMeeting[this.data.currentTodo].targetId,
          "mycanvas",
          160,
          160
      );
    });
  },

  moveToBind() {
    this.setData({
      phoneDialog: false,
    });
    wx.setStorage({
      key: 'bind_phone_auth',
      data: {
        KmTargetId: this.data.myMeeting[this.data.currentTodo].targetId,
        KmTodoType: this.data.myMeeting[this.data.currentTodo].targetType
      }
    });
    wx.setStorage({
      key: 'bind_phone_url',
      data: "../index/index",
      success: (res) => {
        wx.navigateTo({
          url: "../bindPhone/bindPhone?fun=goStorageUrl&auth=true"
        });
      }
    });
  },

  // showPhone() {
  //   this.setData({
  //     phoneDialog: true
  //   })
  // },

  // showPassword() {
  //   this.setData({
  //     passwordDialog: true
  //   })
  // }
});
