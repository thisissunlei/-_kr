
//获取应用实例
const app = getApp();

Page({
  data: {
    imgUrl:app.globalData.KrImgUrl 
  },
  onLoad: function () {
    console.log('app.globalData.KrImgUrl ',app.globalData.KrImgUrl)
  },
 
 
})
