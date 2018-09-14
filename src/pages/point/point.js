//point.js
//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function() {
    return {
      title: "KrMeeting会议室，让会议更轻松、更简单",
      desc: "KrMeeting会议室",
      path: "pages/index/index",
      imageUrl: "../images/share_pic.jpg"
    };
  },
  data: {
    showButton: false
  },
  onLoad: function(options) {
    let that = this;
    // console.log(options);
    if (options.fromTeam == "true") {
      that.setData({
        showButton: true
      });
    }
  },
  jumpIndex: function() {
    wx.navigateTo({
      url: "../index/index"
    });
  }
});
