
//point.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  data: {
   
  },
  onLoad: function () {
    
  },


})
