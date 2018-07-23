const app = getApp();
Page({
  data: {
    userInfo: {
      nickName: "暗淡",
      avatarUrl:
        "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132"
    },
    usedTime: "6月9日（星期三）、6月10日（星期四）、6月15日（星期五）3天",
    bookUserName: "赠送人姓名",
    adress: "北京市朝阳区建国路108号海航大厦氪空间",
    hint: [
      {
        title: "1.到了如何使用移动工位？",
        text: "您到现场出示二维码认证成功后，运营人员会帮您打开会议室门哦~"
      },
      {
        title: "2. 到了KrMeeting，怎么入场呀？",
        text:
          "出示入场二维码（在小程序的“我的会议”里），保安小哥哥验证后就可以入场啦～"
      },
      {
        title: "3. 可以订一个小一点的会议室、多一些人入场吗？",
        text: "入场人数不能超过所订会议室的可容纳人数哦！！"
      },
      {
        title: "4. 我订的会议室被别人占用怎么办？",
        text: "前台小姐姐会在会议开始前协调，保证亲的会议顺利开始，不用担心呢～"
      },
      {
        title: "5. 水吧台的茶饮和咖啡看起来好赞，取用需要付费吗？",
        text: "都是免费的、而且不限量哦，自助取用就可以啦～"
      },
      {
        title: "6. 会议室的无线投屏设备好先进，使用需要额外付费吗？",
        text:
          "也是免费的哦，找前台小姐姐登记领取就可以啦（使用方法见会议桌上的提示卡，很简单呢），离开时记得归还哦~"
      },
      {
        title: "7. 订的使用时段结束了，会还没开完怎么办呢？",
        text: "可以在KrMeeting小程序续订哦～"
      },
      {
        title: "8. 大厅环境太好了，开完会想多待会儿可以吗？",
        text:
          "所订时段结束后的10分钟内可以在大厅休整啦，之后前台小姐姐会依依不舍的送亲离开哦！"
      }
    ]
  },
  onLoad: function() {
    // this.login();
    // this.getInvitation();
    // var that = this;
    // var value = wx.getStorageSync("user_info");
    // that.setData({
    //   userInfo: value.user_info
    // });
    // this.getInvitation();
  },
  getInvitation: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/ticket/card/detail",
      data: {
        ticketIds: 1
      },
      success: res => {
        console.log(res);
      }
    });
  },
  invitation: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/ticket/receiveTicket",
      data: {
        ticketId: 1
      },
      success: res => {
        console.log(res);
      }
    });
  },
  //授权
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      // console.log(e.detail.userInfo);
      //保存到storage里
      wx.setStorageSync("user_info", e.detail.userInfo);
      this.login();
      // this.getInvitation();

      wx.showToast({
        title: "成功领取入场券",
        icon: "success",
        duration: 2000
      });
      setTimeout(() => {
        wx.redirectTo({
          url: `../seatDetail/seatDetail`
        });
      }, 2000);
    } else {
      // console.log("用户拒绝授权");
    }
  },
  //登陆
  login: function() {
    var that = this;
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
              // setTimeout(function() {
              //   wx.hideLoading();
              // }, 2000);
              // console.log(res, "登陆接口成功");
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              // console.log(app.globalData.Cookie, "cookie");
              app.globalData.openid = res.data.data["openid"];
              // console.log(app.globalData.openid);
              that.getUserInfo();
              that.getInvitation();
              // that.invitation();
            },
            fail: function(res) {
              // console.log(res, 8888887777);
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
    var _this = this;
    wx.getUserInfo({
      success: function(res) {
        var wechatInfo = {
          wechatAvatar: res.userInfo.avatarUrl,
          wechatNick: res.userInfo.nickName
        };
        _this.setData({
          wechatInfo: wechatInfo
        });
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
        console.log(888, err);
      }
    });
  }
});
