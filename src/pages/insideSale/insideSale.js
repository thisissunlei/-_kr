
//获取应用实例
const app = getApp();

Page({
  data: {
    imgUrl:app.globalData.KrImgUrl,
    status:'aa',
    saleList:true,
    ruleModal:false,
  },
  onLoad: function () {
   
  },
  myCatchTouch: function () {
    return;
  },
  modalHide(){
    this.setData({
      ruleModal:!this.data.ruleModal
    })
  }
 
})
