const app = getApp();
// import {demoAnimate,demoAnimates} from '../../utils/animate.js';
Page({
  data: {
    hasUserInfo: false,
    assistance: {},
    rule: false,
    user_info: "",
    assistanceFlag: true,
    alsoAssistanceFlag: false,
    alsoAssistanceAmount: "",
    page: 1,
    pageNum: 1,
    pageSize: 10,
    totalPages: 1,
    isMoreFlag: false,
    amountIsFull: false, // 被助力人礼券池已满弹框
    assistantAmountIsFull: false, // 助力人礼券池已满
    amountIsFullTen: false, // 每天助力超过10次 限制
    animateMoneyFlag: false, //钱动画
    pageLoadFlag: true, //页面加载
    wechatAvatar: "",
    wechatNick: "",
    amount: "",
    // weChatId:'1383',
    weChatId: "",
    totalAmount: "",
    totalCount: "",
    isNew: false,
    items: [],
    numArr: [{ label: "0" }, { label: "0" }],
    numArrs: [{ label: "0" }, { label: "0" }],
    number: "520",
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    animationOne: "",
    animationTwo: "",
    initOne: "one",
    initOnes: "one",
    initTwo: "two",
    initTwos: "two",
    error: false,
    errorMessage: "",
    moreFlag: false,
    pageOnloadFlag: false, //页面加载前 判断 跳转状态
    activityFlag: false, // 判断活动 是否 结束
    isAssistanceFlag: false,
    isNewUser: false, // 切换 新人双倍 弹框状态
    isNewUserFlag: false // 调用SAVA接口后  保存 是否是新人判断
    // animationCloudData:''
  },
  aaa: 3445,
  james: "",
  other: "",
  onLoad(options) {
    let weChatId;
    if (options.scene) {
      weChatId = decodeURIComponent(options.scene);
    } else if (options.weChatId) {
      weChatId = options.weChatId;
    }
    wx.reportAnalytics("viewassis");
    this.setData({
      weChatId: weChatId || 183
    });
    let that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    // 判断活动是否结束
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
        } else {
          that.setData({
            activityFlag: false
          });
          wx.getSetting({
            success: res => {
              if (res.authSetting["scope.userInfo"]) {
                that.setData({
                  hasUserInfo: true
                });
                that.login();
              } else {
                that.login();
              }
            }
          });
        }
      }
    });
  },
  onReady() {
    let that = this;
    let numArr = this.data.numArr;
    let numArrs = this.data.numArrs;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    setTimeout(function() {
      that.setData({
        initTwos: "two two-animation delay",
        initTwo: "two two-animation",
        initOnes: "one one-animation delay",
        initOne: "one one-animation"
      });
      wx.hideLoading();
    }, 1500);
  },
  //页面上拉触底事件
  onReachBottom: function() {
    const that = this;
    if (that.data.page < that.data.totalPages) {
      that.setData({
        page: (that.data.page += 1),
        pageLoadFlag: false
      });
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
        data: {
          page: that.data.page,
          pageSize: that.data.pageSize,
          wechatId: that.data.weChatId
        },
        success: res => {
          that.setData({
            items: [].concat(that.data.items, res.data.data.items),
            totalAmount: res.data.data.totalAmount,
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
            page: that.data.page,
            pageLoadFlag: true
          });
          if (res.data.data.totalPages > that.data.page) {
            that.setData({
              isMoreFlag: true
            });
          } else {
            that.setData({
              isMoreFlag: false
            });
          }
        }
      });
    }
  },
  //登录
  login: function() {
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            methods: "GET",
            data: {
              code: res.code
            },
            success: res => {
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
            },
            fail: err => {}
          });
        } else {
        }
      }
    });
  },
  goToHome: function() {
    wx.redirectTo({
      url: "../index/index"
    });
  },
});
