//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    inviteer:[],
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
  // inviteeId:inviteeId,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    console.log(options,"options")
    var inviteeId = options.id
    
    //数据加载
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
      // url:'https://www.easy-mock.com/mock/5b0bf5b41725f034fca4cc78/kr/mettingdetail/meetingdetail',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        inviteeId:inviteeId
      },
      success:(res)=>{
        console.log(res,"会议详情")
        this.setData({
          meetingTime:res.data.data.meetingTime,
          themeName:res.data.data.themeName,
          meetingRoomName:res.data.data.meetingRoomName,
          address:res.data.data.address,
          inviteer:res.data.data.inviteer,
          limitCount:res.data.data.limitCount,
          status:res.data.data.status
        })
      }
    })
    this.createQrCode('fdfd',"mycanvas",160,160);
  },

  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);
    var that = this;
  },
  onShareAppMessage: function (res) {
    console.log(res,8888)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '戳我一键参会！邀请您于“{{this.data.meetingTime}}在"{{this.data.meetingRoomName}}"参加“{{this.data.themeName}}””',
      path: '/meetingDetail/meetingDetail?inviteeId='+inviteeId,
      
    }
  }
})
