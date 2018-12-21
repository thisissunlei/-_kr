const app = getApp();
Page({
  data: {
    type: "",
    seatId: 0,
    usedTime: "",
    bookUserName: "",
    adress: "",
    bookUserAvatar: "",
    KrImgUrl: app.globalData.KrImgUrl,
    hint: [
      {
        title: "Q：到了大厦怎么进去呀，有门禁吗？",
        text:
          "A：亲到了氪空间需要出示“我的散座”中的二维码“门票”给保安呦，保安验证后就会给您开门啦～"
      },
      {
        title: "Q：预订的散座是什么样的呀，座位能挑选吗？",
        text:
          "A：散座类型有办公桌椅、咖啡厅类型的沙发配茶几、吧台椅、卡座等类型的，亲可以在提前预留的座位或没人使用的座位中挑选哦～"
      },
      {
        title: "Q：在使用散座期间能接待访客吗？",
        text:
          "A：亲订的散座是单人单天的哦，如需接待访客可提前预订相应人数的散座，也可以在访客到访时段订一个会议室哦～"
      },
      {
        title: "Q：使用散座期间能多次出入吗，出去了再进来怎么办？",
        text:
          "A：可以多次出入哦，亲出去不需要刷卡，再次进来时出示您的订单详情页面给保安小哥哥就好啦～"
      },
      {
        title: "Q：水吧台的茶饮和咖啡看起来好赞，取用需要付费吗？",
        text: "A：都是免费的、而且不限量哦，自助取用就可以啦～"
      }
    ],
    hintPlus: [
      { text: "❊ 不可在氪空间任何位置进行广告或销售活动哦！" },
      { text: "❊ 不可进入会员办公区及打扰到社区其他会员哦！" },
      { text: "❊ 不可改变社区任何设施，如有损坏需赔偿哦！" },
      { text: "❊ 不可吸烟哦！" },
      { text: "❊ 不可进行违反法律规定的任何事项哦！" }
    ],
    phoneDialog: false,
    passwordDialog: false,
    password: ''
  },
  onLoad: function(options) {
    var that = this;
    console.log(options);
    if (options.seatId) {
      that.setData({
        seatId: options.seatId,
        type: options.type
      });
    }
    wx.reportAnalytics("enter_invitation_letter");
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    that.login();
    that.getInvitation();
  },
  //邀请函接口
  getInvitation: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/ticket/card/detail",
      data: {
        id: that.data.seatId,
        type: that.data.type
      },
      success: function(res) {
        wx.hideLoading();
        
        if (res.data.code == 1) {
          let data = res.data.data;
          console.log(data);
          that.setData({
            bookUserName: data.bookUserName,
            usedTime: data.usedTime,
            adress: data.adress,
            bookUserAvatar: data.bookUserAvatar || ''
          });
        }
      }
    });
  },
  //领取入场券接口
  invitation: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/ticket/receiveTicket",
      data: {
        id: that.data.seatId,
        type: that.data.type
      },
      // data: {
      //   id: 192,
      //   type: "TICKET"
      // },
      success: res => {
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: "成功领取入场券",
            icon: "success",
            duration: 2000
          });
          app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
            methods: "GET",
            header: {
              'content-type': "appication/json"
            },
            success: (res) => {
              let userInfo = Object.assign({}, res.data.data);
              if (userInfo.phone && userInfo.phone.length > 0) {
                setTimeout(() => {
                  this.goSanZuo();
                }, 2000);
              } else {
                this.setData({
                  phoneDialog: true,
                })
              }
            }
          });
        } else if (res.data.code == -2) {
          if (that.data.type == "ORDER") {
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000
            });
          } else {
            wx.showToast({
              title: "您已领取过票啦",
              icon: "none",
              duration: 2000
            });
          }
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
  //授权
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      // console.log(e.detail.userInfo);
      //保存到storage里
      // wx.setStorageSync("user_info", e.detail.userInfo);
      wx.setStorage({
        key: "user_info",
        data: {
          user_info: e.detail.userInfo
        }
      });
      this.getUserInfo();
      this.invitation();
    } else {
      console.log("用户拒绝授权");
    }
  },
  //登陆
  login: function() {
    let that = this;
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
              // console.log(res);
              console.log(res, "登陆接口成功");
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getUserInfo();
            },
            fail: function(res) {
              console.log(res, 8888887777);
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  //获取用户信息
  getUserInfo: function() {
    // var _this = this;
    wx.getUserInfo({
      success: function(res) {
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/krmting/user/save",

          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: res => {
            // console.log(res, 5555888888881111);
          }
        });
      },
      fail: function(err) {
        // console.log(888, err);
      }
    });
  },

  moveToBind() {
    this.setData({
      phoneDialog: false,
    });
    wx.setStorage({
      key: 'bind_phone_auth',
      data: {
        KmTargetId: this.data.seatId,
        KmTodoType: 'SEAT'
      }
    });
    wx.setStorage({
      key: 'bind_phone_url',
      data: "../mysanzuo/mysanzuo",
      success: (res) => {
        wx.navigateTo({
          url: "../bindPhone/bindPhone?fun=goStorageUrl&auth=true"
        });
      }
    });
  },

  closeDialog() {
    this.setData({
      phoneDialog: false,
      passwordDialog: false
    })
  },

  goSanZuo() {
    wx.redirectTo({
      url: `../mysanzuo/mysanzuo`
    });
  },

  closeDialogAndGo() {
    this.setData({
      phoneDialog: false,
      passwordDialog: false
    }, () => {
      this.goSanZuo();
    })
  }
});
