//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    inviteer:[],
    inviteeId:'',
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
    console.log(options)
    var inviteeId = options.inviteeId
    this.getData();
  },
  //获取数据列表
  getData(){
    app.getRequest({
      // url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
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
          meetingTime:res.data.data.meetingTime,
          themeName:res.data.data.themeName,
          meetingRoomName:res.data.data.meetingRoomName,
          address:res.data.data.address,
          inviteer:res.data.data.inviteer,
          limitCount:res.data.data.limitCount,
          meetingStatus:res.data.data.meetingStatus
        })
      }
    })
  },
  //点击我要参与
  jion:function(){
    wx.getStorage({
      key: 'user_info',
      success:(res)=>{
        console.log(res)
        let user_info = {
          wechatAvatar : res.data.user_info.avatarUrl,
          wechatNick : res.data.user_info.nickName
        }
        this.setData({
          user_info:user_info
        })
        this.data.inviteer.push(user_info)
        this.setData({
          inviteer:this.data.inviteer
        })
      },
    })
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/invitee/confirmArriving',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        inviteeId:this.data.inviteeId
      },
      success:(res)=>{
        console.log(res,"会议详情")
      }
    })
  },
  //点击我要预定
  proceed:function(){
    wx.redirectTo({
      url:"../index/index"
    })
  }
})
