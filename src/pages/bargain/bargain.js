//index.js
import Poster from "../wxa-plugin-canvas/poster/poster";
import {demoAnimate, demoAnimates} from "../../utils/numAnimate.js";
// import { demoAnimate, demoAnimates } from "../../utils/animate.js";

const app = getApp();
Page({
  data: {
    userInfo: {
      // 用户信息
      avatarUrl: '',
      nickName: '',
      hasPhone: true
    },
    disInfo: {
      cutId: '',
      hasDis: false, // 是否已砍价
      hasUsed: false, // 优惠码是否已用
      current: '', // 当前折扣
      disNum: '', // 当前已砍几折
      code: '', // 折扣码
      selfDisNum: '', // 自己砍了几折
    },
    selfSuccess: false,
    showShareFriend: false,
    showShare: false,
    showSuccess: false,
    recordList: [], //好友助力
    KrImgUrl: app.globalData.KrImgUrl,
    noticeList: [], //轮播信息
    hasUserInfo: false, // 是否授权用户信息
    // comList: ['霄云路社区', '王府井银泰社区', '人民广场海洋大厦', '延安西路嘉宁国际', '人民广场中区广场',  '外滩中心',  '华山路御华山',  '浦东宝钢大厦',  '钱江新城平安金融中心',  '世茂海峡国际',  '创新科技广场',  '协鑫广场'],
    showPicker: false,
    objectList: [
      {
        id: 215,
        name: '北京·霄云路社区'
      },
      {
        id: 179,
        name: '北京·王府井银泰社区'
      },
      {
        id: 181,
        name: '上海·人民广场海洋大厦'
      },
      {
        id: 200,
        name: '上海·延安西路嘉宁国际'
      },
      {
        id: 203,
        name: '上海·人民广场中区广场'
      },
      {
        id: 202,
        name: '上海·外滩中心'
      },
      {
        id: 185,
        name: '上海·华山路御华山'
      },
      {
        id: 205,
        name: '上海·浦东宝钢大厦'
      },
      {
        id: 188,
        name: '杭州·钱江新城平安金融中心'
      },
      {
        id: 206,
        name: '厦门·世茂海峡国际'
      },
      {
        id: 208,
        name: '合肥·创新科技广场'
      },
      {
        id: 207,
        name: '苏州·协鑫广场'
      },
    ],
    comIndex: '',
    tempComId: '215',
    comId: '',
    totalCount: 0,
    totalPages: 1,
    canShowBtn: false,
    imgUrl: "",
    showRule: false, //活动规则
    hasLoadUserInfo: false,
    activityFlag: true, // 判断活动 是否 结束
    hasLogin: false,
    recordParams: {
      page: 1,
      pageSize: 10,
    },
  },
  wechatId: null, // 发起人微信id
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
            this.wechatId = res.data.data.wechatId || '';
            this.getMoreUserInfo();
            this.getActivityFlag();
            this.getBroadcast();
            this.getCutId();
            // wx.hideLoading();
            // console.log(res);
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
        })
      }
    })
  },


  // 创建 cutId 或查询 cutId
  getCutId: function () {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/create-new",
      success: res => {
        this.setData({
          ['disInfo.cutId']: res.data.data || ''
        }, () => {
          this.getDiscount();
          this.getFriendsBooster();
        });
      }
    });
  },

  // 获取折扣
  getDiscount: function () {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/coupon-view",
      data: {cutId: this.data.disInfo.cutId},
      success: res => {
        console.log('res', res)
        wx.hideLoading();
        const data = res.data.data || {}
        this.setData({
          ['disInfo.current']: data.amount || '',
          ['disInfo.hasDis']: data.status === 'CUTSELF' ? false : true,
          ['disInfo.hasUsed']: data.status === 'FINISH' ? true : false,
          ['disInfo.disNum']: data.totalDeductAmount || '',
          ['disInfo.code']: data.code || '',
          canShowBtn: true
        });
      },
      fail: res => {
        wx.hideLoading();
      }
    });
  },

  // 领取轮播信息接口
  getBroadcast: function () {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/booster/marquee",
      success: res => {
        // console.log(res);
        console.log('marquee', res.data)
        this.setData({
          noticeList: res.data.data
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
        data: Object.assign({}, this.data.recordParams, {
          boosterId: this.wechatId,
          cutId: this.data.disInfo.cutId
        }),
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
    })
  },

  selfReduce: function () {
    if (!this.data.activityFlag) return;
    if (this.data.disInfo.hasUsed) {
      this.getInfo();
    } else if (this.data.disInfo.hasDis) {
      // 喊朋友来补刀
      this.shareView();
    } else if (this.data.userInfo.hasPhone) {
      this.setData({
        tempComId: 215,
        showPicker: true
      })
    }
  },

  closePicker() {
    this.setData({
      showPicker: false
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.objectList[e.detail.value].id)
    this.setData({
      tempComId: this.data.objectList[e.detail.value].id
    })
  },

  selectCom() {
    this.setData({
      comId: this.data.tempComId
    }, () => {
      this.closePicker();
      this.reduce();
    })
  },

  // 自己砍价接口
  reduce: function (e) {
    // console.log(e);
    // this.setData({
    //   selfSuccess: true
    // })
    console.log(this.data.userInfo)
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmseatcut/boost",
      method: "POST",
      data: {
        boosterId: this.wechatId,
        communityId: this.data.comId,
        cutId: this.data.disInfo.cutId
      },
      success: res => {
        console.log(res);
        if (res.data.code == 1) {
          const data = res.data.data || {};
          this.setData({
            selfSuccess: true,
            ['disInfo.hasDis']: true,
            ['disInfo.current']: data.amount,
            ['disInfo.disNum']: data.totalDeductAmount,
            ['disInfo.selfDisNum']: data.myCutAmount,
            ['disInfo.code']: data.code
          });
          this.getFriendsBooster();
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
        path: "pages/bargainFriend/bargainFriend?wechatId=" + this.wechatId + "&cutId=" + this.data.disInfo.cutId,
        imageUrl: this.data.KrImgUrl + "bargainActivity/share_help.png"
      };
    } else {
      // console.log("来自右上角转发菜单");
      return {
        title: "氪空间可以5折租工位啦，一起来砍价抢特惠~",
        path: "pages/bargainIndex/bargainIndex",
        imageUrl: this.data.KrImgUrl + "bargainActivity/share_wx.png"
      };
    }
  },

  getPhoneNumber: function (e) {
    console.log(e);
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
          if (res.data.code == 1) {
            this.setData({
              ['userInfo.hasPhone']: true
            }, () => {
              this.selfReduce();
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000
            });
          }
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

  //去首页
  goToHome: function () {
    wx.reLaunch({
      url: "../index/index"
    });
  },

  // 绑定模板消息
  formSubmit(e) {
    let formId = e.detail.formId;
    console.log('formId', formId);
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmboostermsg/collect-formId",
      data: {
        formId: formId
      },
      success: res => {
        console.log(res);
      }
    });
  },

  //页面上拉触底事件
  onReachBottom: function () {
    // const that = this;
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
      selfSuccess: false
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
        page: "pages/bargainFriend/bargainFriend",
        scene: this.wechatId + '&' + this.data.disInfo.cutId
      },
      success: res => {
        // todo: check
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
