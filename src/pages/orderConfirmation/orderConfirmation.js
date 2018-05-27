//orderConfirmation.js
//获取应用实例
const app = getApp()
var newDate=new Date();
var theme=newDate;


Page({
  data: {
    motto: 'Hello World',
    theme:'0510会议',
  },
  //事件处理函数
  jumpSetTheme:function() {
      console.log('---->>>>',this.data)
    // wx.navigateTo({
    //   url: '../meetingTheme/meetingTheme?value='+meetingTheme
    // })
   
  },
  onLoad: function (options) {
   
  },
  
})
