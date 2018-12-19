//app.js
App({
  onLaunch: function() {
    console.log('app.js----onLaunch')
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    /*wx.setEnableDebug({
      enableDebug: true
    });*/
    // 登录
    wx.setTabBarStyle({
      color: "#000000",
      selectedColor: "#00FF00",
      backgroundColor: "#000000",
      borderStyle: "black"
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    KrUrl: "https://i.krspace.cn/test08/",
    Cookie: "",
    share_data: {
      title: "开启轻松、灵活办公新方式",
      desc: "氪空间自由座",
      path: "pages/index/index"
    },
    KrImgUrl: "https://web.krspace.cn/kr-meeting/kr-meeting-images/"
  },
  getRequest: function(data) {
    const that = this;
    if (data.url.indexOf("api/gateway/krmting/user/save") > 0) {
      data.data["openid"] = this.globalData.openid;
    }
    wx.request({
      url: data.url,
      method: data.method || "get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: this.globalData.Cookie
      },
      data: data.data,
      success: function(data_new) {
        if (data_new.data.code == 4011) {
          console.log(data_new, 666655555);
          that.loginAgain();
        } else {
          data.success(data_new);
        }
        //if()
      },
      fail: data.fail
    });
  },
  loginAgain: function() {
    const that = this;
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
              that.func_bool_l = true;
              that.func_bool_l2 = true;
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              if (that.func_bool_g && that.func_bool_l) {
                that.func_bool_g = false;
                that.func_bool_l = false;
                that.getAllInfo();
              }
              if (that.func_bool_l2 && that.func_bool_s) {
                that.func_bool_s = false;
                that.func_bool_l2 = false;
                that.getInfo();
              }
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  }
});
