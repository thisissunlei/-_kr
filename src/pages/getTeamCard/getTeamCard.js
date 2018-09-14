const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    showPage: false, //显示整个页面
    showButton: true, //底部button切换
    disabled: false, //分享是否过期
    hasUserInfo: false,
    showHint: true, //toast提示
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    info: {}
  },
  cardId: null,
  shareKey: "",
  onLoad: function(options) {
    let that = this;
    console.log(options);
    that.cardId = options.cardId;
    that.shareKey = options.shareKey;
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

          that.login();
        } else {
          that.login();
        }
      }
    });
  },
  //跳转新人引导页面
  jumpToHome: function() {
    wx.navigateTo({
      url: "../point/point?fromTeam=true"
    });
  },
  //跳转团队卡页面
  jumpToTeamCardList: function() {
    wx.navigateTo({
      url:
        "../teamCardDetails/teamCardDetails?fromTeam=true&cardId=" + this.cardId
    });
  },
  //接受邀请接口
  accept: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/addholder",
      method: "post",
      data: {
        cardId: that.cardId
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        });
        if (res.data.code > 0) {
          that.setData({
            showButton: false,
            showHint: false
          });
        }
      }
    });
  },
  //团队卡详情接口
  getTeamCard: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/sharedetail",
      data: {
        cardId: that.cardId
      },
      success: res => {
        console.log(res);
        let mansion = Object.assign({}, res);
        let teamCardInfo = mansion.data.data;
        teamCardInfo.faceValue = that.toThousands(teamCardInfo.faceValue);
        teamCardInfo.effectAt = that.toDate(teamCardInfo.effectAt);
        teamCardInfo.expireAt = that.toDate(teamCardInfo.expireAt);
        that.setData({
          info: res.data.data,
          showPage: true
        });
      }
    });
  },
  //分享是否过期接口
  checkShare: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/overdue",
      data: {
        cardId: that.cardId,
        shareKey: that.shareKey
      },
      success: res => {
        console.log(res);
        if (!res.data.data) {
          that.setData({
            disabled: true
          });
        }
      }
    });
  },
  //金额格式化
  toThousands: function(num) {
    var num = (num || 0).toString(),
      result = "";
    while (num.length > 3) {
      result = "," + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  },
  //时间戳格式化
  toDate: function(number) {
    var date = new Date(number);
    var Y = date.getFullYear();
    var M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return Y + "." + M + "." + D;
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
              wx.hideLoading();
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getTeamCard();
              that.checkShare();
              that.getInfo();
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
