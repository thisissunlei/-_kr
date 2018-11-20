//index.js
import Poster from "../wxa-plugin-canvas/poster/poster";
import {demoAnimate, demoAnimates} from "../../utils/numAnimate.js";
// import { demoAnimate, demoAnimates } from "../../utils/animate.js";

const app = getApp();
Page({
  data: {
    // 发起人用户信息
    originInfo: {
      avatarUrl: '',
      nickName: '',
      wechatId: ''
    },
    // 当前用户信息
    userInfo: {
      avatarUrl: '',
      nickName: '',
      wechatId: ''
    },
    disInfo: {
      cutId: '',
      hasHelpDis: false, // 是否已帮助过砍价
      hasUsed: false, // 优惠码是否已用
      current: '', // 当前折扣
      disNum: '', // 当前已砍几折
      deductAmount: '', // 已帮砍几折
    },
    helpSuccess: false, // 帮砍成功
    showShareFriend: false,
    showShare: false,
    showSuccess: false,
    hasHelpSuccess: false, // 已经帮好友砍过
    recordList: [], //好友助力
    KrImgUrl: app.globalData.KrImgUrl,
    hasUserInfo: false, // 是否授权用户信息
    hasPhone: true, //是否有手机号
    comIndex: '',
    comId: '',
    totalCount: 0,
    totalPages: 1,
    canShow: false, // 判断判断是否是用户本人结束，可以展现页面或重定向
    canShowBtn: false,
    imgUrl: "",
    showRule: false, //活动规则
    hasLoadUserInfo: false,
    activityFlag: true, // 判断活动 是否 结束
    hasLogin: false,
    recordParams: {
      page: 1,
      pageSize: 10,
    }
  },
  wechatId: null, // 发起人微信id
  reduceFlag: true, // 砍价拦截
  jdConfig: {
    width: 765,
    height: 1068,
    backgroundColor: "#fff",
    debug: false,
    images: [
      {
        width: 765,
        height: 1068,
        x: 0,
        y: 0,
        borderRadius: 16,
        url: "/pages/images/shareBg.png",
        zIndex: 2
      }
    ]
  },
  weImg: {
    width: 486,
    height: 486,
    x: 136,
    y: 390,
    url: "",
    zIndex: 1
  },
  onLoad: function (options) {
    console.log('options', options);
    wx.reportAnalytics("view_fridens_assist");
    if (options.cutId && options.wechatId) {
      this.setData({
        ['disInfo.cutId']: options.cutId,
        ['originInfo.wechatId']: options.wechatId
      });
      this.wechatId = options.wechatId;
    } else if (options.scene){
      let allCode = decodeURIComponent(options.scene).split('_');
      console.log('sceneCode', allCode)
      this.setData({
        ['disInfo.cutId']: allCode[1],
        ['originInfo.wechatId']: allCode[0]
      });
      this.wechatId = allCode[0];
    }
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
    if (this.data.hasLogin) {
      this.getDiscount();
      this.getFriendsBooster();
    }
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
              wx.hideLoading();
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
            // 判断如果是用户本人跳回发起页面
            if (res.data.data.wechatId == this.wechatId) {
              wx.redirectTo({
                url: "../bargain/bargain"
              });
            } else {
              this.setData({
                canShow: true
              });
              this.getActivityFlag();
              this.getMoreUserInfo();
              this.getDiscount();
              this.getFriendsBooster();
              // wx.hideLoading();
            }
          },
          fail: () => {
            wx.hideLoading();
          }
        });
      }
    });
  },

  //活动是否结束
  getActivityFlag: function () {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/ovedue",
      method: "GET",
      data: {
        activityId: 2
      },
      success: res => {
        // console.log("活动是否过期", res);
        if (res.data.data) {
          this.setData({
            activityFlag: false
          });
        } else {
          this.setData({
            activityFlag: true
          });
        }
      }
    });
  },

  // 获取用户(发起人)头像、昵称等信息
  getMoreUserInfo: function () {
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
      data: {
        wechatId: this.wechatId
      },
      methods: "GET",
      header: {
        'content-type': "appication/json"
      },
      success: (res) => {
        let userInfo = Object.assign({}, res.data.data);
        console.log('userInfo', userInfo)
        this.setData({
          ['originInfo.avatarUrl']: userInfo.wechatAvatar || '',
          ['originInfo.nickName']: userInfo.wechatNick || ''
        })
      }
    })
  },


  // 获取折扣
  getDiscount: function () {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/coupon-view",
      data: {cutId: this.data.disInfo.cutId, boosterId: this.wechatId},
      success: res => {
        console.log('res', res)
        wx.hideLoading();
        const data = res.data.data || {}
        this.setData({
          ['disInfo.current']: data.amount || '',
          ['disInfo.hasHelpDis']: data.boosterFlag,
          ['disInfo.hasUsed']: data.status === 'FINISH' ? true : false,
          ['disInfo.disNum']: data.totalDeductAmount || '',
          ['disInfo.deductAmount']: data.myCutAmount || '',
          canShowBtn: true
        });
      },
      fail: res => {
      }
    });
  },


  // 好友助力接口
  getFriendsBooster: function () {
    this.setData({
      ['recordParams.page']: 1
    }, () => {
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmseatcut/friends-booster-record",
        data: Object.assign({}, this.data.recordParams, {boosterId: this.wechatId, cutId: this.data.disInfo.cutId}),
        success: res => {
          // console.log(res);
          // this.totalPages = res.data.data.totalPages;
          this.setData({
            recordList: res.data.data.items.map(item => {
              item.ctime = this.toDate(item.ctime);
              return item;
            }),
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
          });
        }
      });
    });

  },

  selfReduce: function () {
    if (this.data.activityFlag && !this.data.disInfo.hasUsed && !this.data.disInfo.hasHelpDis) {
      this.reduce();
    }
  },

  // 砍价接口
  reduce: function () {
    if (!this.reduceFlag) return;
    this.reduceFlag = false;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    wx.reportAnalytics("click_help_bargain");
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/boost",
      method: "POST",
      data: {
        boosterId: this.wechatId,
        cutId: this.data.disInfo.cutId
      },
      success: res => {
        wx.hideLoading();
        this.reduceFlag = true;
        if (res.data.code == 1) {
          const data = res.data.data || {};
          this.setData({
            helpSuccess: true,
            ['disInfo.hasHelpDis']: true,
            ['disInfo.current']: data.amount,
            ['disInfo.disNum']: data.totalDeductAmount,
            ['disInfo.deductAmount']: data.myCutAmount
          });
          this.getFriendsBooster();
        } else if (res.data.code == -3) {
          this.setData({
            hasHelpSuccess: true
          })
        } else {
          wx.showToast({
            title: res.data.message || '',
            icon: "none",
            duration: 2000
          });
        }
      },
      fail: res => {
        wx.hideLoading();
        this.reduceFlag = true;
      }
    });
  },


  goKrSpace() {
    wx.navigateTo({
      url: "../krSpace/krSpace"
    });
  },

  goCoupon() {
    this.closeDialog();
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },

  goBargain() {
    wx.reportAnalytics("click_bargain_too");
    this.closeDialog();
    wx.navigateTo({
      url: "../bargain/bargain"
    });
  },

  //去首页
  goToHome: function () {
    wx.reLaunch({
      url: "../index/index"
    });
  },

  //页面上拉触底事件
  onReachBottom: function () {
    // const that = this;
    if (this.data.recordParams.page < this.data.totalPages) {
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmseatcut/friends-booster-record",
        data: Object.assign({}, this.data.recordParams, {
          boosterId: this.wechatId,
          cutId: this.data.disInfo.cutId
        }, {page: this.data.recordParams.page + 1}),
        success: res => {
          // console.log(res);
          this.setData({
            recordList: [].concat(this.data.recordList, res.data.data.items.map(item => {
              item.ctime = this.toDate(item.ctime);
              return item;
            })),
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
            ['recordParams.page']: this.data.recordParams.page + 1
          });
        }
      });
    }
  },
  //活动规则
  helpingRule: function () {
    // wx.reportAnalytics("clickrule");

    this.setData({
      showRule: true
    });
  },
  //关闭活动规则
  closeRule: function () {
    this.setData({
      showRule: false
    });
  },
  closeDialog() {
    this.setData({
      showShare: false,
      showSuccess: false,
      helpSuccess: false,
      hasHelpSuccess: false
    });
  },


  //拉取授权
  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
  },

  //时间戳格式化
  toDate: function (number) {
    var date = new Date(number);
    var Y = date.getFullYear();
    var M =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var S =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + "-" + M + "-" + D + " " + H + ":" + m + ":" + S;
  }
});
