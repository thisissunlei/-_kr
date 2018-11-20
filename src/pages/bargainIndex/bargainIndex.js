//index.js

const app = getApp();
Page({
  data: {
    userInfo: {},
    hasLogin: false,
    KrImgUrl: app.globalData.KrImgUrl,
    hasUserInfo: false,
    hasLoadUserInfo: false

  },
  onLoad: function (options) {
    wx.reportAnalytics("viewbargain_index");
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
  goActivity: function () {
    wx.reportAnalytics("click_bargain");
    wx.navigateTo({
      url: "../bargain/bargain"
    });
  },

  //转发分享
  onShareAppMessage: function (res) {
    return {
      title: "暖冬不寒心，氪空间工位五折感恩回馈，一起砍价抢优惠~",
      path: "pages/bargainIndex/bargainIndex",
      // imageUrl: this.data.KrImgUrl + "bargainActivity/share_wx.png"
      imageUrl: "/pages/images/share/share_wx.png"
    };
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
            console.log('getInfo======')
            // this.goActivity()
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
    console.log('拉取授权', e);
    if (e.detail.userInfo) {
      this.getInfo();
      this.goActivity()
      this.setData({
        hasUserInfo: true
      });
    }
  },

});
