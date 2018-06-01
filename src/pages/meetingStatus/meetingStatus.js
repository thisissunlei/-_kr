//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    inviteer:[],
    inviteeId:'',
    user_info:{},
    btn_bool:true,
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
    const that = this;
    console.log(options)
    let inviteeId = options.inviteeId
    this.setData({
      inviteeId:inviteeId
    })
    that.login();
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log(999999776)
        }else{
          that.login();
          that.getUserInfo();
          that.setData({
            btn_bool:false
          });
        }
      }
    })
    
  },
  onGotUserInfo:function (e){
    console.log(e,"eeeeeee")
    if(e.detail.inviteeId){
      this.login();
    }
  },
  //登陆
  login:function(){
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.KrUrl+'api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              app.globalData.Cookie = res.header['Set-Cookie']||res.header['set-cookie'];
              that.getUserInfo();
              that.detailList();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }),
    this.setData({
      btn_bool:false
    });
  },
  
  //获取用户信息
  getUserInfo:function(){
   var _this = this;
    wx.getUserInfo({
      success: function(res) {   
        console.log('===========>>>>',res.userInfo) 
        var wechatInfo = {
          wechatAvatar: res.userInfo.avatarUrl,
          wechatNick:res.userInfo.nickName
        }
        _this.setData({
          wechatInfo:wechatInfo
        })
      }
      
    })
  },
  
  //获取数据列表
  detailList:function(){
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        inviteeId:this.data.inviteeId
      },
      success:(res)=>{
        console.log(res,"会议状态")
        this.setData({
          meetingTime:res.data.data.meetingTime,
          themeName:res.data.data.theme,
          meetingRoomName:res.data.data.meetingRoomName,
          address:res.data.data.address,
          inviteer:res.data.data.inviteers,
          limitCount:res.data.data.limitCount,
          meetingStatus:res.data.data.meetingStatus,
        })
      }
    })
  },
  
  //点击我要参与
  jion:function(){
    console.log(this.data.wechatInfo)
    this.data.inviteer.push(this.data.wechatInfo)
    this.setData({
      inviteer:this.data.inviteer
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
        console.log(res,"确认参加")
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
