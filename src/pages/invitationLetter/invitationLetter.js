const app = getApp();
Page({
  data: {
    userInfo: null
  },
  onLoad: function() {
    var that = this;
    var value = wx.getStorageSync("user_info");
    that.setData({
      userInfo: value.user_info
    });
  }
});
