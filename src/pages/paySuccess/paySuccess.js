//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    off:true,
    conferee:[
      {
        'name':'刘佳佳'
      },
      {
        'name':'molly'
      },
      {
        'name':'谭烨'
      },
      {
        'name':'沈美美'
      },
      {
        'name':'段郝耀'
      },
      {
        'name':'蒋萌'
      }
    ],
    hint:[
      {
        'title':'到了如何使用会议室？',
        'text':'您到现场出示二维码认证成功后，运营人员会帮您打开会议室门哦~'
      },
      {
        'title':'到了如何到了使用到了会议室？',
        'text':'您到现场出示二维码认证成功后，运营人员会帮您打开会议室门哦~'
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.createQrCode('fdfd',"mycanvas",160,160);
    this.getData()
  },
  getData(){
    wx.request({
      url:'https://www.easy-mock.com/mock/5b0bf5b41725f034fca4cc78/kr/mettingdetail/meetingdetail',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        inviteeId:this.data.inviteeId
      },
      success:(res)=>{
        console.log(res,"会议详情")
        this.setData({
          meetingTime:res.data.meetingTime,
          themeName:res.data.themeName,
          meetingRoomName:res.data.meetingRoomName,
          address:res.data.address,
          inviteer:res.data.inviteer,
          limitCount:res.data.limitCount,
          meetingStatus:res.data.meetingStatus
        })
      }
    })
  },
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);
    var that = this;
  },

  //关闭弹层
  off:function(e){
    this.setData({
      off:false
    })
  },
})
