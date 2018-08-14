const app = getApp();

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    donatorAvatar:
      "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEI7cUnQcZ7OauSOxnNVANUuFx0sxG0RWZa7yGMBSuKicGD9OFMYsPp7viaDKWS2BylsgQ2icOGcJOA3w/132",
    donatorThirdNick: "隔壁的刘设计、",
    couponList: [
      {
        couponId: 71217,
        couponName: "测试内容r836",
        couponStatus: "测试内容y6i8",
        couponValidTime: "测试内容7235",
        faceValue: "测试内容6436"
      },
      {
        couponId: 71218,
        couponName: "测试内容r836",
        couponStatus: "测试内容y6i8",
        couponValidTime: "测试内容7235",
        faceValue: "测试内容6436"
      }
    ],
    shareNo: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function(options) {
    var that = this;
    console.log(options);
    if (options.shareNo) {
      that.setData({
        shareNo: options.shareNo
      });
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.hideLoading();
          that.setData({
            hasUserInfo: true
          });
          that.getCouponList();
        } else {
          that.login();
        }
      }
    });
  },
  //礼品券详情接口
  getCouponList: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcoupon/share/list",
      data: {
        shareNo: 1 //that.data.shareNo
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  //领取礼品券接口

  //登录
  login: function() {
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
              wx.hideLoading();
              //   console.log(res);
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getCouponList();
            },
            fail: err => {
              console.log(err);
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  //拉取授权
  onGotUserInfo: function(e) {
    // console.log(e);
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
  },
  //获取用户信息
  getInfo: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        // console.log(res);
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
          success: res => {
            // console.log(res);
            // that.getDetail();
          }
        });
      }
    });
  }
});
