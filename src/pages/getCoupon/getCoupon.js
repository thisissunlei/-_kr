const app = getApp();

Page({
  data: {
    showPage: false, //显示整个页面
    showHint: false, //显示领取成功提示语
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    donatorAvatar: "",
    donatorThirdNick: "",
    buttonShow: true, //底部button显示
    couponList: [],
    shareNo: ""
  },
  onLoad: function(options) {
    let that = this;
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
          that.setData({
            hasUserInfo: true
          });
          // wx.hideLoading();

          that.login();
        } else {
          that.login();
        }
      }
    });
  },
  //礼品券详情接口
  getCouponList: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcoupon/share/list",
      data: {
        shareNo: that.data.shareNo
      },
      success: res => {
        console.log(res);
        wx.hideLoading();

        if (res.data.code == 1) {
          let couponList = Object.assign({}, res);
          that.setData({
            showPage: true,
            couponList: couponList.data.data.couponList,
            donatorAvatar: couponList.data.data.donatorAvatar,
            donatorThirdNick: couponList.data.data.donatorThirdNick
          });

          couponList.data.data.couponList.map(item => {
            console.log(item);
            if (item.couponStatus == "GET") {
              that.setData({
                buttonShow: false
              });
            }
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  //领取礼品券接口"081808160157"
  getCoupon: function(e) {
    console.log(e.currentTarget.dataset.id);
    let that = this;
    let couponId = e.currentTarget.dataset.id;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcoupon/share/receive",
      method: "POST",
      data: {
        couponId: couponId,
        shareNo: that.data.shareNo
      },
      success: res => {
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: "领取成功",
            image: "../images/public/success.png",
            duration: 3000
          });
          that.setData({
            buttonShow: false,
            showHint: true
          });
          that.getCouponList();
        } else if (res.data.code < 0) {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 3000
          });
        }
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  jumpIndex: function() {
    wx.redirectTo({
      url: "../index/index"
    });
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
              // wx.hideLoading();
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
    let that = this;
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
          }
        });
      }
    });
  }
});
