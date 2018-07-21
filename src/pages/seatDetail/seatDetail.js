//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp();
Page({
  data: {
    width: 0,
    seatId: 0, //我的散座传过来的id
    seatStatus: "EXPIREDe",
    detail: {},
    partner: [],
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
    ]
  },
  //分享
  onShareAppMessage: res => {
    if (res.from === "button") {
      // console.log("来自页面赠送按钮");
      // console.log(res.target);
      return {
        title: "来来来，发现一个办公的好地儿~",
        desc: "KrMeeting会议室",
        path: "pages/invitationLetter/invitationLetter"
        // imageUrl: "../images/share_pic.jpg"
      };
    } else {
      // console.log("来自右上角转发菜单");
      return app.globalData.share_data;
    }
  },

  //再订一个
  goIndex: function() {
    wx.reLaunch({
      url: "../index/index"
    });
  },
  //我不去了
  cancelSeat: function() {
    var that = this;
    try {
      let invitee = wx.getStorageSync("user_info");
      if (invitee) {
        // console.log(invitee);
        that.data.partner.map((item, index) => {
          // console.log(item, index);
          if (item.wechatNick == "辛薛亮") {
            that.data.partner.splice(index, 1);
          }
          return item;
        });
      }
      console.log(that.data.partner);
    } catch (e) {}
  },
  onLoad: function(options) {
    console.log(options);

    var that = this;
    that.setData({
      seatId: options.seatId
    });

    //设置canvsa大小
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res);
        that.width = res.windowWidth;
      }
    });
    if (that.data.seatStatus === "EXPIRED") {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_meeting/index.html?inviteeId=" + that.seatId,
        "mycanvas",
        that.width / 2.5,
        that.width / 2.5,
        null,
        "rgba(0,0,0,0.6)"
      );
    } else {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_meeting/index.html?inviteeId=" + that.seatId,
        "mycanvas",
        that.width / 2.5,
        that.width / 2.5
      );
    }
    this.getSeatInfo();

    //同行人
    // var value = wx.getStorageSync("user_info");
    // console.log(value.user_info);
    // that.setData({
    //   imgsrc: value.user_info.avatarUrl,
    //   name: value.user_info.nickName
    // });
  },

  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  getSeatInfo: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/myseat/detail",
      data: {
        ticketUserId: 21
      },
      success: function(res) {
        console.log(res);
        var seatInfo = Object.assign({}, res);
        // console.log(seatInfo);
        var newUser = wx.getStorageSync("user_info");
        console.log(newUser);
        // var sponsor = seatInfo.data.data.sponsor;
        var inviteers = seatInfo.data.data.inviteers;
        // console.log(newUser);
        // if (!sponsor) {
        //   var result = inviteers.some(value => {
        //     return value.wechatNick == newUser.nickName;
        //   });
        //   if (!result) {
        // inviteers.push({
        //   wechatNick: newUser.nickName,
        //   wechatAvatar: newUser.avatarUrl
        // });
        //   }
        // }

        // seatInfo.data.data.sponsor = false;
        // seatInfo.data.data.limitCount = 0;
        // seatInfo.data.data.canInvite = true;
        that.setData({
          detail: seatInfo.data.data,
          partner: inviteers
        });
        // console.log(that.data.detail);
      }
    });
  }
});
