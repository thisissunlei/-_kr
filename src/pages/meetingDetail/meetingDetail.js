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
        'title':'Q：我订了会议室，要提前多久入场呀？',
        'text':'A：会议室使用时间前10分钟可以进入大厅哦，如果订的会议室没有人就可以提前进入啦～'
      },
      {
        'title':'Q：到了KrMeeting，怎么入场呀？',
        'text':'A：出示入场二维码（在小程序的“我的会议”里），保安小哥哥验证后就可以入场啦～'
      },
      {
        'title':'Q：可以订一个小一点的会议室、多一些人入场吗？',
        'text':'A：前台小姐姐会在会议开始前协调，保证亲的会议顺利开始，不用担心呢～！'
      },
      {
        'title':'Q：我订的会议室被别人占用怎么办？',
        'text':'A：出示入场二维码（在小程序的“我的会议”里），保安小哥哥验证后就可以入场啦～'
      },
      {
        'title':'Q：水吧台的茶饮和咖啡看起来好赞，取用需要付费吗？',
        'text':'A：都是免费的、而且不限量哦，自助取用就可以啦～'
      },
      {
        'title':'Q：会议室的无线投屏设备好先进，使用需要额外付费吗？',
        'text':'A：也是免费的哦，找前台小姐姐登记领取就可以啦（使用方法见会议桌上的提示卡，很简单呢），离开时记得归还哦~'
      },
      {
        'title':'Q：订的使用时段结束了，会还没开完怎么办呢？',
        'text':'A：可以在KrMeeting小程序续订哦～'
      },
      {
        'title':'Q：大厅环境太好了，开完会想多待会儿可以吗？',
        'text':'A：所订时段结束后的10分钟内可以在大厅休整啦，之后前台小姐姐会依依不舍的送亲离开哦！'
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
        wx.reportAnalytics('Share Meeting')

    return {
      title: '戳我一键参会！邀请您于"'+this.data.meetingTime+'"在"'+this.data.meetingRoomName+'"参加"'+this.data.themeName+'"',
      path: 'pages/meetingStatus/meetingStatus?inviteeId='+this.data.inviteeId, 
    }
  },

  //点击取消参会
  cancelMeeting(){
    let that = this;
        wx.reportAnalytics('Cancel Meeting')
    
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
