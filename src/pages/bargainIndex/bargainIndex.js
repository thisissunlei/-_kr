//index.js

const app = getApp();
Page({
  data: {
    userInfo: {},
    hasLogin:false,
    KrImgUrl: app.globalData.KrImgUrl,
    hasUserInfo:false,
    hasLoadUserInfo:false

    },
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });


    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          this.setData({
            hasUserInfo: true
          });
        }
        this.login();
        this.setData({
          hasLoadUserInfo: true
        })
      }
    });
  },
  onReady: function () {
    // this.getDiscount();
  },
  onShow: function () {
  },
  goActivity:function(){
    wx.navigateTo({
      url: "../bargain/bargain"
    });
  },

  // 登录
  login: function () {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            methods: "GET",
            data: {
              code: res.code
            },
            success: res => {
              wx.hideLoading();
              app.globalData.Cookie = res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              this.setData({
                hasLogin: true
              });
              this.getInfo();
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

  // 获取用户信息
  getInfo: function () {
    wx.getUserInfo({
      success: (res) => {
        // console.log(res);
        wx.setStorage({
          key: "user_info",
          data: {
            user_info: res.userInfo
          }
        });
        this.setData({
          ['userInfo.avatarUrl']: res.userInfo.avatarUrl,
          ['userInfo.nickName']: res.userInfo.nickName
        });
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/krmting/user/save",
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: res => {
            this.setData({
              ['userInfo.wechatId']: res.data.data.wechatId || ''
            });
            // wx.hideLoading();
          }
        });
      }
    });
  },


  // 获取用户wechatId，是否绑定手机号等信息
  getMoreUserInfo: function () {
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
      methods: "GET",
      header: {
        'content-type': "appication/json"
      },
      success: (res) => {
        let userInfo = Object.assign({}, res.data.data);
        console.log('userInfo', userInfo)
        this.setData({
          ['userInfo.hasPhone']: (userInfo.phone && userInfo.phone.length > 0) ? true : false,
          // todo wechatId可在save接口中获取
          // ['userInfo.wechatId']: userInfo.wechatId || ''
        })
      }
    })
  },

  //拉取授权
  onGotUserInfo: function (e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
  },

});
