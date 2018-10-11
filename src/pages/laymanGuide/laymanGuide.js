const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    imgUrls: [
      "/image/u25.png",
      "/image/u27.png",
      "/image/u29.png",
      "/image/u24.png"
    ],
    swiperCurrent: 0
  },
  swiperChange: function(e) {
    // console.log(e);
    this.setData({
      swiperCurrent: e.detail.current //获取当前轮播图片的下标
    });
  },
  jumpToIndex: function() {
    wx.reLaunch({
      url: "../index/index?fromPage=guide"
    });
  }
});
