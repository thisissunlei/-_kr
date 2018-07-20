//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp();
Page({
  data: {
    width: 0,
    seatId: 1234, //我的散座传过来的id
    canInvite: true, //是否可以赠送
    count: 1, //剩余赠送数量
    sponsor: true, //是否是创建人
    imgsrc: "",
    name: "",
    detail: {},
    //address buildFloorDescr canInvite limitCount useTime
    //arrving notArrving sponsor wechatAvatar wechatId wechatNick
    // detail1: {
    //   address: "北京市朝阳区建国路108号北京市朝阳区建",
    //   bookId: "预订人id",
    //   buildFoorDesc: "大厦楼层地址",
    //   //是否可以赠送入场券
    //   canInvite: true,
    //   // canInvite: false,
    //   inviteer: "使用人",
    //   //是否是创建人
    //   // sponsor: false,
    //   sponsor: true,
    //   wechatAvatar: "微信头像",
    //   wechatId: "微信id",
    //   wechatNick: "微信昵称",
    //   limitCount: 0,
    //   openTime: "06-07 (周四）",
    //   //是否过期
    //   seatStatus: "EXPIREDe",
    //   length: 1
    // },
    partner: [
      {
        name: "暗淡1",
        imgsrc:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132"
      },
      {
        name: "暗淡",
        imgsrc:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132"
      }
    ],
    hint: [
      {
        title: "1. 我订了会议室，要提前多久入场呀？",
        text:
          "会议室使用时间前10分钟可以进入大厅哦，如果订的会议室没有人就可以提前进入啦～"
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
          if (item.name == invitee.nickName) {
            that.data.partner.splice(index, 1);
          }
        });
      }
      console.log(that.data.partner);
    } catch (e) {}
  },
  onLoad: function(options) {
    this.getSeatInfo();
    var that = this;
    //设置canvsa大小
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res);
        that.width = res.windowWidth;
      }
    });
    if (that.data.detail.seatStatus === "EXPIRED") {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_meeting/index.html?inviteeId=" + that.seatId,
        "mycanvas",
        that.width / 2.5,
        that.width / 2.5,
        null,
        "rgba(0,0,0,0.6)"
      );
      that.setData({
        canInvite: false
      });
    } else {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_meeting/index.html?inviteeId=" + that.seatId,
        "mycanvas",
        that.width / 2.5,
        that.width / 2.5
      );
    }
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
        ticketUserId: 1
      },
      success: function(res) {
        // console.log(res);
        var seatInfo = Object.assign({}, res);
        console.log(seatInfo);
        that.setData({
          detail: seatInfo.data.data
        });
      }
    });
  }
});
