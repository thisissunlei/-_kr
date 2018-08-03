//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp();
Page({
  data: {
    seatStatus: "TOUSE"
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      console.log("来自页面赠送按钮");
      // console.log(res);
      //   return {
      //     title: "来来来，发现一个办公的好地儿~",
      //     path:
      //       "pages/invitationLetter/invitationLetter?type=TICKET&seatId=" +
      //       this.data.ticketId,
      //     imageUrl: "../images/map/seativt.png"
      //   };
    } else {
      console.log("来自右上角转发菜单");
      return app.globalData.share_data;
    }
  },

  onLoad: function(options) {
    // console.log(options);
    // wx.showLoading({ title: "加载中" });
  },
  onReady: function() {
    var that = this;

    if (that.data.seatStatus == "EXPIRED" || that.data.seatStatus == "USED") {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_seat/index.html?inviteeId=" +
          that.data.seatId,
        "mycanvas",
        150,
        150,
        null,
        "rgba(0,0,0,0.3)"
      );
      that.setData({ canInvite: false });
      // console.log(that.data.canInvite);
    } else {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_seat/index.html?inviteeId=" +
          that.data.seatId,
        "mycanvas",
        150,
        150
      );
    }
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  onShow: function() {}
});
