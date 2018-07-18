const app = getApp();
Page({
  data: {
    userInfo: null,
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
    var that = this;
    var value = wx.getStorageSync("user_info");
    that.setData({
      userInfo: value.user_info
    });
    // this.getInvitation();
  },
  getInvitation: function(options) {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/ticket/card/detail",
      data: {
        ticketIds: [1, 2, 3]
      },
      success: res => {
        console.log(res);
      }
    });
  }
});
