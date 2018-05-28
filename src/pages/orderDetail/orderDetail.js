//index.js
//获取应用实例
import CAlculagraph from "../../utils/time.js" ;

const app = getApp()

Page({
  data: {
    minute:'',
    second:''
  },
  //事件处理函数
  

  onLoad: function () {
    console.log(CAlculagraph)
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:new Date().getTime()/1000+300,//最终结束的时间戳,
      callback:function (){
        console.log(111)
      },//时间结束
      that:this
    });
    wx.setNavigationBarTitle({
      title: '当前页面'
    })
  }
   
})
