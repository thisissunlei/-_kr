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
    helpSuccess: false,
    showShareFriend: false,
    showShare: false,
    showSuccess: false,
    recordList: [
      {
        avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541749815&di=c7a50db92e6268c348643536c01d227b&src=http://file29.mafengwo.net/M00/7B/34/wKgBpVYdGOiAS71LAABuKaLQB_887.groupinfo.w600.jpeg',
        name: '哈哈',
        time: '2018-11-05 13:00:09',
        dis: '0.28'
      },
      {
        avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541749815&di=c7a50db92e6268c348643536c01d227b&src=http://file29.mafengwo.net/M00/7B/34/wKgBpVYdGOiAS71LAABuKaLQB_887.groupinfo.w600.jpeg',
        name: '哈哈',
        time: '2018-11-05 13:00:09',
        dis: '0.2'
      },
      {
        avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541749815&di=c7a50db92e6268c348643536c01d227b&src=http://file29.mafengwo.net/M00/7B/34/wKgBpVYdGOiAS71LAABuKaLQB_887.groupinfo.w600.jpeg',
        name: '哈哈',
        time: '2018-11-05 13:00:09',
        dis: '0.10'
      },
      {
        avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541749815&di=c7a50db92e6268c348643536c01d227b&src=http://file29.mafengwo.net/M00/7B/34/wKgBpVYdGOiAS71LAABuKaLQB_887.groupinfo.w600.jpeg',
        name: '哈哈',
        time: '2018-11-05 13:00:09',
        dis: '0.06'
      }
    ], //好友助力
    KrImgUrl: app.globalData.KrImgUrl,
    hasUserInfo: false, // 是否授权用户信息
    hasPhone: true, //是否有手机号
    comList: ['美国', '中国', '巴西', '日本'],
    objectList: [
      {
        id: 22,
        name: '美国'
      },
      {
        id: 133,
        name: '中国'
      },
      {
        id: 244,
        name: '巴西'
      },
      {
        id: 355,
        name: '日本'
      }
    ],
    comIndex: '',
    comId: '',
    totalCount: 0,
    totalPages: 1,


    number: "000",
    imgUrl: "",
    showRule: false, //活动规则
    currentData: 0, //选项卡
    hasLoadUserInfo: false,
    myBooster: 0, //礼券池总金额
    page: 1,
    showAnimation: false, //提取动画
    animationStart: false,
    animationDataOne: "",
    animationDataTwo: "",
    animationDataThree: "",
    couponInfo: {},
    friendBoosterNone: false,
    boosterRecordNone: false,
    activityFlag: true, // 判断活动 是否 结束
    hasLogin: false,
    recordParams: {
      page: 1,
      pageSize: 10,
    }
  },
  wechatId: null, // 发起人微信id


  // totalPages: 1,


  page: 1,
  pageSize: 10,
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
  // james: "",
  onLoad: function (options) {
    console.log('options', options);
    if (options.cutId && options.wechatId) {
      this.setData({
        ['disInfo.cutId']: options.cutId,
        ['originInfo.wechatId']: options.wechatId
      });
      this.wechatId = options.wechatId;
    } else {

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
            // if (res.data.data.wechatId == this.wechatId) {
            // wx.redirectTo({
            //   url: "../bargain/bargain"
            // });
            // } else {
            this.getActivityFlag();
            this.getMoreUserInfo();
            this.getDiscount();
            this.getFriendsBooster();
            wx.hideLoading();
            // }

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
        const data = res.data.data || {}
        this.setData({
          ['disInfo.current']: data.amount || '',
          ['disInfo.hasHelpDis']: data.boosterFlag,
          ['disInfo.hasUsed']: data.status === 'FINISH' ? true : false,
          ['disInfo.disNum']: data.totalDeductAmount || '',
          ['disInfo.deductAmount']: data.myCutAmount || ''
        });
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
            recordList: res.data.data.items,
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
          });
        }
      });
    });

  },

  selfReduce: function () {
    if (this.data.disInfo.hasUsed) {

    } else if (this.data.disInfo.hasHelpDis) {
      // 喊朋友来补刀
      // this.shareView();
    } else {
      this.reduce();
    }
  },

  // 砍价接口
  reduce: function (e) {
    // console.log(e);
    // this.setData({
    //   helpSuccess: true
    // })
    console.log(this.data.userInfo)
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/boost",
      method: "POST",
      data: {
        boosterId: this.wechatId,
        cutId: this.data.disInfo.cutId
      },
      success: res => {
        console.log(res);
        if (res.data.code == 1) {
          const data = res.data.data || {};
          this.setData({
            helpSuccess: true,
            ['disInfo.hasHelpDis']: true,
            ['disInfo.current']: data.amount,
            ['disInfo.disNum']: data.totalDeductAmount,
            ['disInfo.selfDisNum']: data.deductAmount,
            ['disInfo.code']: data.code
          })
        } else {
          wx.showToast({
            title: res.data.message || '',
            icon: "none",
            duration: 2000
          });
        }
      }
    });
  },

  callFriend() {
    this.closeDialog();
    this.shareView();
  },
  // 喊朋友来助力按钮
  shareView: function () {
    this.setData({
      showShareFriend: !this.data.showShareFriend
    });
  },

  //转发分享
  onShareAppMessage: function (res) {
    if (res.from === "button") {
      // console.log("来自页面赠送按钮");
      // wx.reportAnalytics("clickcallfriends");
      // console.log(that.wechatId);
      this.shareView();
      return {
        title: "跪求补刀！帮砍5折工位券，点一下你也能获得礼券哦~",
        path: "pages/bargainFriend/bargainFriend?wechatId=" + this.wechatId + "cutId=" + this.data.disInfo.cut,
        imageUrl: this.data.KrImgUrl + "helpingActivity/details/share1.jpg"
      };
    } else {
      // console.log("来自右上角转发菜单");
      return {
        title: "邀请好友助力，商旅办公最高可享免单，快来参与吧~",
        path: "pages/createImg/createImg",
        imageUrl: this.data.KrImgUrl + "helpingActivity/details/share2.jpg"
      };
    }
  },

  getPhoneNumber: function (e) {
    console.log(e);
    const that = this;
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

          that.setData({
            ['userInfo.hasPhone']: true
          });
        },
        fail: res => {
        }
      });
    }
  },

  goKrSpace() {
    wx.navigateTo({
      url: "../krSpace/krSpace"
    });
  },

  goCoupon() {
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },

  goBargain() {
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
    // console.log(this.currentData);
    if (this.data.recordParams.page < this.data.totalPages) {
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmseatcut/friends-booster-record",
        data: Object.assign({}, this.recordParams, {
          boosterId: this.wechatId,
          cutId: this.data.disInfo.cutId
        }, {page: this.data.recordParams.page + 1}),
        success: res => {
          // console.log(res);
          this.setData({
            recordList: [].concat(this.data.recordList, res.data.data.items),
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
  //跳转我的礼品券
  jumpMyCoupon: function () {
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },
  closeDialog() {
    this.setData({
      showShare: false,
      showSuccess: false,
      helpSuccess: false
    });
  },
  saveImg() {
    //保存图片到本地
    let that = this;
    wx.saveImageToPhotosAlbum(
        {
          filePath: that.data.imgUrl,
          success: function (res) {
            console.log("success", res);
            that.setData({
              showShare: false,
              showSuccess: true
            });
          },
          fail: function (res) {
            console.log("fail", res);
          }
        },
        this
    );
    //保存图片到本地--end
  },
  onPosterSuccess(e) {
    const {detail} = e;
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
    // wx.reportAnalytics("clicksharemonments");
    let weImg = this.weImg;
    let jdConfig = this.jdConfig;
    this.shareView();

    wx.showLoading({
      title: "加载中"
    });

    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster-qr/promocode",
      data: {
        page: "pages/assistance/assistance",
        scene: this.wechatId
      },
      success: res => {
        // let code = res.data.code;
        // if (code === 1) {
        //   weImg.url = res.data.data;
        //   jdConfig.images.push(weImg);
        //   this.setData(
        //       {
        //         jdConfig: jdConfig
        //       },
        //       function () {
        //         Poster.create();
        //       }
        //   );
        // } else {
        //   wx.showToast({
        //     icon: "none",
        //     title: res.data.message
        //   });


        weImg.url = res.data.data
        weImg.url =
            "https://img.krspace.cn/activity/image/0/2018/09/25/115630761C2e8epT.jpg";
        jdConfig.images.push(weImg);
        this.setData(
            {
              jdConfig: jdConfig
            },
            function () {
              Poster.create();
            }
        );
        // }
      }
    });
  },
  // animate() {
  //   let that = this;
  //   this.james = new demoAnimate({
  //     // numArr: that.data.numArr,
  //     // number: that.data.number,
  //     _this: that
  //   });
  // },

  /**
   * 异步生成海报
   */
  onCreatePoster() {
    Poster.create();
  },

  toStringAmount: function (num) {
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
  getRegetRecordscords: function () {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/take-records",
      data: {
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        // that.totalPages = res.data.data.totalPages;
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
  onGotUserInfo: function (e) {
    console.log(e);
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
