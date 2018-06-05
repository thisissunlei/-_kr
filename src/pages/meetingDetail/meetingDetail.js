//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  data: {
    inviteer:[],
    inviteeId:'',
    footer:'',
    contact:'',
    contact:false,
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
    var inviteeId = options.inviteeId
    this.setData({
      inviteeId:inviteeId
    })
    //数据加载
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
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
          themeName:res.data.data.theme,
          meetingRoomName:res.data.data.meetingRoomName,
          address:res.data.data.address,
          inviteer:res.data.data.inviteers,
          limitCount:res.data.data.limitCount,
          meetingStatus:res.data.data.meetingStatus,
        })
        if(this.data.meetingStatus==='EXPIRED'){
          this.setData({
            footer:false,
            contact:true
          })
        }else{
          this.setData({
            footer:true,
            contact:false
          })
        }
      }
    })
    this.createQrCode('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.data.inviteeId,"mycanvas",150,150);
   
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
      title: '戳我一键参会！邀请您于"'+this.data.meetingTime+'"在"'+this.data.meetingRoomName+'"参加"'+this.data.themeName+'"',
      path: 'pages/meetingStatus/meetingStatus?inviteeId='+this.data.inviteeId, 
    }
  },

  //点击取消参会
  cancelMeeting(){
    let that = this;
    wx.getStorage({
      key: 'user_info',
      success:(res)=>{
        that.data.inviteer.forEach((item,index)=>{ 
          if(item.wechatAvatar === res.data.user_info.avatarUrl && item.wechatNick === res.data.user_info.nickName){
            that.data.inviteer.splice(index, 1)
          }    
        })
        this.setData({
          inviteer:that.data.inviteer
        })
      },
    })
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/invitee/cancel',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        inviteeId:this.data.inviteeId
      },
      success:(res)=>{
        console.log(res,"取消参会")
        wx.redirectTo({
          url:"../index/index"
        })
      }
    })
  }
})
