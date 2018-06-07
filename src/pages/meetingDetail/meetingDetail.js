//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  data: {
    codeShade:false,
    inviteer:[],
    inviteeId:'',
    footer:'',
    contact:'',
    contact:false,
    hint:[
      {
        'title':'1. 我订了会议室，要提前多久入场呀？',
        'text':'会议室使用时间前10分钟可以进入大厅哦，如果订的会议室没有人就可以提前进入啦～'
      },
      {
        'title':'2. 到了KrMeeting，怎么入场呀？',
        'text':'出示入场二维码（在小程序的“我的会议”里），保安小哥哥验证后就可以入场啦～'
      },
      {
        'title':'3. 可以订一个小一点的会议室、多一些人入场吗？',
        'text':'入场人数不能超过所订会议室的可容纳人数哦！！'
      },
      {
        'title':'4. 我订的会议室被别人占用怎么办？',
        'text':'前台小姐姐会在会议开始前协调，保证亲的会议顺利开始，不用担心呢～'
      },
      {
        'title':'5. 水吧台的茶饮和咖啡看起来好赞，取用需要付费吗？',
        'text':'都是免费的、而且不限量哦，自助取用就可以啦～'
      },
      {
        'title':'6. 会议室的无线投屏设备好先进，使用需要额外付费吗？',
        'text':'也是免费的哦，找前台小姐姐登记领取就可以啦（使用方法见会议桌上的提示卡，很简单呢），离开时记得归还哦~'
      },
      {
        'title':'7. 订的使用时段结束了，会还没开完怎么办呢？',
        'text':'可以在KrMeeting小程序续订哦～'
      },
      {
        'title':'8. 大厅环境太好了，开完会想多待会儿可以吗？',
        'text':'所订时段结束后的10分钟内可以在大厅休整啦，之后前台小姐姐会依依不舍的送亲离开哦！'
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
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
        setTimeout(function(){
          wx.hideLoading();
        },2000)
        console.log(res,"会议详情")
        this.setData({
          meetingTime:res.data.data.meetingTime||'',
          themeName:res.data.data.theme||'',
          meetingRoomName:res.data.data.meetingRoomName||'',
          address:res.data.data.address||'',
          inviteer:res.data.data.inviteers||[],
          limitCount:res.data.data.limitCount||'',
          meetingStatus:res.data.data.meetingStatus||'',
        })
        if(res.data.data.meetingStatus==='EXPIRED' || res.data.data.meetingStatus==='ARRVING'){
          this.setData({
            footer:false,
            contact:true,
          })
        }else{
          this.setData({
            footer:true,
            contact:false,
          })
        }
        console.log(res.data.data.meetingStatus)
        if(res.data.data.meetingStatus==='EXPIRED'){
          console.log(1)
          QR.qrApi.draw('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.data.inviteeId,"mycanvas",150,150,null,'rgba(0,0,0,0.6)');
        }else{
          console.log(2)
          QR.qrApi.draw('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.data.inviteeId,"mycanvas",150,150);
        }
      }
    })
    
    //this.createQrCode('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.data.inviteeId,"mycanvas",150,150);
   
  },
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
        wx.reportAnalytics('sharemeeting')

    return {
      title: '戳我一键参会！邀请您于"'+this.data.meetingTime+'"在"'+this.data.meetingRoomName+'"参加"'+this.data.themeName+'"',
      path: 'pages/meetingStatus/meetingStatus?inviteeId='+this.data.inviteeId, 
      imageUrl:'../images/indexImg/statusbg.png'
    }
  },

  //点击取消参会
  cancelMeeting(){
    wx.reportAnalytics('cancelmeeting')
    let that = this;
    wx.showModal({
      title: '提示',
      content: '取消参会后，会议开始前您可以从我的订单或会议邀请中，再次参加会议哦～',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.getRequest({
            url:app.globalData.KrUrl+'api/gateway/krmting/invitee/cancel',
            methods:"GET",
            header:{
              "content-type":"application/json"
            },
            data:{
              inviteeId:that.data.inviteeId
            },
            success:(res)=>{
              console.log(res,"取消参会")

              wx.getStorage({
                key: 'user_info',
                success:(res)=>{
                  that.data.inviteer.forEach((item,index)=>{ 
                    if(item.wechatAvatar === res.data.user_info.avatarUrl && item.wechatNick === res.data.user_info.nickName){
                      that.data.inviteer.splice(index, 1)
                    }    
                  })
                  that.setData({
                    inviteer:that.data.inviteer
                  })
                },
              })
              
            }
          })
          wx.reLaunch({
            url:"../index/index"
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          
        }
      }
    })
    
    
    
  }
})
