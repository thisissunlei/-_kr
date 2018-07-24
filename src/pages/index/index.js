//index.js
//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function(res) {
    wx.reportAnalytics("sharekrmeeting");
    console.log(res);
    return {
      title: "KrMeeting会议室，让会议更轻松、更简单",
      desc: "KrMeeting会议室",
      path: "pages/index/index",
      imageUrl: "../images/share_pic.jpg"
    };
  },
  data: {
    // noSwiper: true,
    indicatorDots: true,
    autoplbuildAddressay: true,
    interval: 5000,
    duration: 1000,
    // swiper: false,
    indicatorDots: true,
    // metting: true,
    btn_bool: true,
    duration: 1000,
    buildingList: [],
    myMeeting: [],
    noOpenBuilding: []
    // noOpenBuilding: [
    //   {
    //     buildName: "海峡国际大厦",
    //     buildAddress: "北京市西城区三里河东路30号院1号楼海峡国际大厦",
    //     buildImgUrl: "../images/indexImg/hxgj.jpg",
    //     distance: "",
    //     meetingCount: "18"
    //   },
    //   {
    //     buildName: "吉祥大厦",
    //     buildAddress: "北京市东城区王府井大街88号",
    //     buildImgUrl: "../images/indexImg/jxds.jpg",
    //     distance: "",
    //     meetingCount: "6"
    //   },
    //   {
    //     buildName: "华山路",
    //     buildAddress: "上海市静安区华山路328号",
    //     buildImgUrl: "../images/indexImg/hsl.jpg",
    //     distance: "",
    //     meetingCount: "18"
    //   },
    //   {
    //     buildName: "凯旋路",
    //     buildAddress: "上海市长宁区凯旋路399号1幢",
    //     buildImgUrl: "../images/indexImg/kxl.jpg",
    //     distance: "",
    //     meetingCount: "18"
    //   },
    //   {
    //     buildName: "由由国际",
    //     buildAddress: "上海市浦东新区浦建路76号由由国际广场写字楼",
    //     buildImgUrl: "../images/indexImg/zygj.jpg",
    //     distance: "",
    //     meetingCount: "6"
    //   },
    //   {
    //     buildName: "由由世纪",
    //     buildAddress: "上海市浦东新区杨高南路428号由由世纪1号楼写字楼名义楼层",
    //     buildImgUrl: "../images/indexImg/zysj.jpg",
    //     distance: "",
    //     meetingCount: "6"
    //   },
    //   {
    //     buildName: "田林路",
    //     buildAddress: "上海市徐汇区田林路130号20号楼",
    //     buildImgUrl: "../images/indexImg/tll.jpg",
    //     distance: "",
    //     meetingCount: "8"
    //   }
    // ]
  },
  rq_data: {
    latitude: "",
    longitude: ""
  },
  func_bool_g: false,
  func_bool_l: false,
  func_bool_l2: false,
  func_bool_s: false,
  //打开地图
  openmap: function() {
    wx.navigateTo({
      url: "../map/map"
    });
  },
  //获取地理位置
  getLocation: function() {
    var _this = this;
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
      console.log(channelname_v, 11111);
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
          console.log("登录失败！" + res.errMsg);
        }
      }
    });

    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          console.log("用户没有授权：用户信息！");
        } else {
          that.func_bool_s = true;
          if (that.func_bool_s && that.func_bool_l2) {
            that.func_bool_s = false;
            that.func_bool_l2 = false;

            that.getInfo();
          }

          that.setData({
            btn_bool: false
          });
        }
      }
    });
    // this.getAllInfo();
  },
  onShow: function() {
    // this.getAllInfo();
  },
  getAllInfo: function() {
    var that = this;
    //首页接口 krmting/home?latitude=39.916576&longitude=116.443737
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/home",
      data: {
        latitude: that.rq_data.latitude,
        longitude: that.rq_data.longitude
      },
      success: res => {
        var mansion = Object.assign({}, res);
        console.log(mansion, "列表");
        let buildingList = mansion.data.data.buildingList;
        let myMeeting = mansion.data.data.myTodo;
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
  }
});
