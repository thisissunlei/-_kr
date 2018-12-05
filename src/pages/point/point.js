//point.js
//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function() {
    return {
      title: "KrMeeting会议室，让会议更轻松、更简单",
      desc: "KrMeeting会议室",
      path: "pages/index/index",
      imageUrl: app.globalData.KrImgUrl+"share_pic.jpg"
    };
  },
  data: {
    showButton: true,
    KrImgUrl: app.globalData.KrImgUrl
  },
  onLoad: function(options) {
    let that = this;
    console.log(options);
    if (options.fromIndex == "true") {
      that.setData({
        showButton: false
      });
    }
  },
  jumpIndex: function() {
    wx.reLaunch({
      url: "../index/index"
    });
  }
});
