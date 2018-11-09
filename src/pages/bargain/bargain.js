//index.js
import Poster from "../wxa-plugin-canvas/poster/poster";
import { demoAnimate, demoAnimates } from "../../utils/numAnimate.js";
// import { demoAnimate, demoAnimates } from "../../utils/animate.js";

const app = getApp();
Page({
  data: {
    userInfo: {
      avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541749815&di=c7a50db92e6268c348643536c01d227b&src=http://file29.mafengwo.net/M00/7B/34/wKgBpVYdGOiAS71LAABuKaLQB_887.groupinfo.w600.jpeg',
      name: 'test test test test test test ',
      weChatId: ''
    }, // 用户信息
    disInfo: {
      current: '10',
      disNum: 3
    },



    number: "000",
    showSuccess: false,
    KrImgUrl: app.globalData.KrImgUrl,
    imgUrl: "",
    showShare: false,
    showRule: false, //活动规则
    noticeList: [], //轮播信息
    currentData: 0, //选项卡
    recordList: [], //好友助力
    showBottomBtn: false,
    hasUserInfo: false,
    hasLoadUserInfo: false,
    myBooster: 0, //礼券池总金额
    totalAmount: null, //好友助力总金额
    myAmout: null, //我的助力总金额
    page: 1,
    totalCount: null,
    totalPages: null,
    showAnimation: false, //提取动画
    animationStart: false,
    animationDataOne: "",
    animationDataTwo: "",
    animationDataThree: "",
    couponInfo: {},
    hasPhone: true, //是否有手机号
    friendBoosterNone: false,
    boosterRecordNone: false,
    activityFlag: true, // 判断活动 是否 结束
    hasLogin: false
  },
  weChatId: null, //微信id
  page: 1,
  pageSize: 10,
  totalPages: 1,
  currentData: 0,
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
  james: "",
  onLoad: function() {
    // wx.reportAnalytics("viewpoweractivities");
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    setTimeout(() => {
      this.james = new demoAnimate({
        _this: this
      });
    }, 1000);

    // this.animate();
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
  onReady: function() {
    // this.getDiscount();
  },
  onShow: function() {
    if (this.data.hasLogin) {
      this.getDiscount();
    }
  },

  // 登录
  login: function() {
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
              // this.getActivityFlag();
              // this.getUserInfo();
              // this.getDiscount();
              // this.getBroadcast();
              // this.getFriendsBooster();
              // wx.hideLoading();
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
  getInfo: function() {
    wx.getUserInfo({
      success: (res) => {
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
            this.getActivityFlag();
            this.getUserInfo();
            this.getDiscount();
            this.getBroadcast();
            this.getFriendsBooster();
            wx.hideLoading();
            // console.log(res);
          }
        });
      }
    });
  },

  //活动是否结束
  getActivityFlag: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/ovedue",
      method: "GET",
      data: {
        activityId: 1
      },
      success: res => {
        // console.log("活动是否过期", res);
        if (res.data.data) {
          this.setData({
            activityFlag: true
          });
        } else {
          this.setData({
            activityFlag: true
          });
        }
      }
    });
  },
  
  // 获取用户昵称头像信息
  getUserInfo: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/booster-info",
      success: res => {
        console.log(res);
        let newCoupon = res.data.data;
      }
    });
  },

  // 获取折扣
  getDiscount: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/mybooster-pool",
      success: res => {
        console.log("1111111", res);
        console.log("shoujiehao", res.data.data.flag);
        this.weChatId = res.data.data.weChatId;
        this.setData({
          myBooster: res.data.data.amount,
          hasPhone: res.data.data.flag
          // myBooster: 60
        });
        let boosterNumber = res.data.data.amount;
        let result = this.toStringAmount(boosterNumber);
        // console.log(result);
        this.setData({
          number: result
        });
        console.log("result----", result);
        setTimeout(() => {
          this.james.initNum(result);
        }, 1000);
        // that.animate();
      }
    });
  },

  // 领取轮播信息接口
  getBroadcast: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/broadcast",
      success: res => {
        // console.log(res);
        this.setData({
          noticeList: res.data.data
        });
      }
    });
  },

  // 好友助力接口
  getFriendsBooster: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      data: {
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        // console.log(res);
        that.getDiscount();
        that.totalPages = res.data.data.totalPages;
        that.setData({
          recordList: res.data.data.items,
          totalAmount: res.data.data.totalAmount,
          totalCount: res.data.data.totalCount,
          totalPages: res.data.data.totalPages,
          friendBoosterNone: true
        });
      }
    });
  },

  // 自己砍价接口
  reduce: function(e) {
    console.log(e);
    this.setData({
      couponInfo: e.currentTarget.dataset.id
    });
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/take-coupons",
      method: "post",
      data: {
        baseId: e.currentTarget.dataset.id.id
      },
      success: res => {
        console.log(res);
        if (res.data.code == 1) {
          this.setData({
            showAnimation: true,
            animationStart: true
          });
          setTimeout(() => {
            this.setData({
              animationStart: false
            });
          }, 1500);
          setTimeout(() => {
            this.setData({
              showAnimation: false
            });
          }, 3500);
          this.getDiscount();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
  },

  // 喊朋友来助力按钮
  shareView: function() {
    this.setData({
      showBottomBtn: !this.data.showBottomBtn
    });
  },

  //转发分享
  onShareAppMessage: function(res) {
    const that = this;
    if (res.from === "button") {
      // console.log("来自页面赠送按钮");
      wx.reportAnalytics("clickcallfriends");

      // console.log(that.weChatId);
      that.share();
      return {
        title: "快来帮我拿自由座礼券，点一下你也能获得礼券哦~",
        path: "pages/assistance/assistance?weChatId=" + that.weChatId,
        imageUrl: that.data.KrImgUrl + "helpingActivity/details/share1.jpg"
      };
    } else {
      // console.log("来自右上角转发菜单");
      return {
        title: "邀请好友助力，商旅办公最高可享免单，快来参与吧~",
        path: "pages/createImg/createImg",
        imageUrl: that.data.KrImgUrl + "helpingActivity/details/share2.jpg"
      };
    }
  },

  getPhoneNumber: function(e) {
    console.log(e);
    const that = this;
    that.setData({
      couponInfo: e.currentTarget.dataset.id
    });
    let data = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    };
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/krmting/wx/auth/bind-phone",
        methods: "GET",
        data: data,
        success: res => {
          app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmbooster/take-coupons",
            method: "post",
            data: {
              baseId: e.currentTarget.dataset.id.id
            },
            success: res => {
              console.log(res);
              if (res.data.code == 1) {
                that.setData({
                  showAnimation: true,
                  animationStart: true
                });
                setTimeout(() => {
                  that.setData({
                    animationStart: false
                  });
                }, 1500);
                setTimeout(() => {
                  that.setData({
                    showAnimation: false
                  });
                }, 3500);
                that.getDiscount();
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 2000
                });
              }
            }
          });
          that.setData({
            hasPhone: true
          });
        },
        fail: res => {}
      });
    }
  },

  //
  checkCurrent: function(e) {
    // console.log(e);
    const that = this;
    let current = e.currentTarget.dataset.current;
    that.currentData = current;
    that.setData({
      currentData: current
    });
    if (current == 0) {
      that.page = 1;
      that.setData({
        page: 1
      });
      that.getFriendsBooster();
    }
  },
  //去首页
  goToHome: function() {
    wx.reLaunch({
      url: "../index/index"
    });
  },
  closeAnimation: function() {
    this.setData({
      showAnimation: false
    });
  },

  //页面上拉触底事件
  onReachBottom: function() {
    const that = this;
    // console.log(this.currentData);
    if (that.page < that.totalPages) {
      that.page += 1;
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
        data: {
          page: that.page,
          pageSize: that.pageSize
        },
        success: res => {
          // console.log(res);
          that.setData({
            recordList: [].concat(that.data.recordList, res.data.data.items),
            totalAmount: res.data.data.totalAmount,
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
            page: that.page
          });
        }
      });
    }
  },
  //活动规则
  helpingRule: function() {
    wx.reportAnalytics("clickrule");

    this.setData({
      showRule: true
    });
  },
  //关闭活动规则
  closeRule: function() {
    this.setData({
      showRule: false
    });
  },
  //跳转我的礼品券
  jumpMyCoupon: function() {
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },
  closeDialog() {
    this.setData({
      showShare: false,
      showSuccess: false
    });
  },
  saveImg() {
    //保存图片到本地
    let that = this;
    wx.saveImageToPhotosAlbum(
      {
        filePath: that.data.imgUrl,
        success: function(res) {
          console.log("success", res);
          that.setData({
            showShare: false,
            showSuccess: true
          });
        },
        fail: function(res) {
          console.log("fail", res);
        }
      },
      this
    );
    //保存图片到本地--end
  },
  onPosterSuccess(e) {
    const { detail } = e;
    wx.hideLoading();
    this.setData({
      imgUrl: detail,
      showShare: true
    });
  },
  onPosterFail(err) {
    console.error(err);
  },

  createShareCanvas() {
    wx.reportAnalytics("clicksharemonments");
    let weImg = this.weImg;
    let jdConfig = this.jdConfig;
    let that = this;
    that.share();

    wx.showLoading({
      title: "加载中"
    });

    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster-qr/promocode",
      data: {
        page: "pages/assistance/assistance",
        scene: that.weChatId
      },
      success: res => {
        let code = res.data.code;
        if (code === 1) {
          weImg.url = res.data.data;
          jdConfig.images.push(weImg);
          this.setData(
            {
              jdConfig: jdConfig
            },
            function() {
              Poster.create();
            }
          );
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.message
          });
          // weImg.url = res.data.data
          // weImg.url =
          //   "https://img.krspace.cn/activity/image/0/2018/09/25/115630761C2e8epT.jpg";
          // jdConfig.images.push(weImg);
          // this.setData(
          //   {
          //     jdConfig: jdConfig
          //   },
          //   function() {
          //     Poster.create();
          //   }
          // );
        }
      }
    });
  },
  animate() {
    let that = this;
    this.james = new demoAnimate({
      // numArr: that.data.numArr,
      // number: that.data.number,
      _this: that
    });
  },

  /**
   * 异步生成海报
   */
  onCreatePoster() {
    Poster.create();
  },

  toStringAmount: function(num) {
    let len = num.toString().length;
    switch (len) {
      case 1:
        num = "00" + num;
        break;
      case 2:
        num = "0" + num;
        break;
      default:
        return num.toString();
    }
    return num;
  },

  //提取记录接口
  getRecords: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/take-records",
      data: {
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        that.totalPages = res.data.data.totalPages;
        let recordList = res.data.data.items;
        recordList.map(item => {
          item.ctime = that.toDate(item.ctime);
          return item;
        });
        // console.log(res);
        that.setData({
          totalCount: res.data.data.totalCount,
          totalPages: res.data.data.totalPages,
          boosterRecordNone: true
        });
      }
    });
  },


  //拉取授权
  onGotUserInfo: function(e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
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
    var H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var S =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + "-" + M + "-" + D + " " + H + ":" + m + ":" + S;
  }
});
