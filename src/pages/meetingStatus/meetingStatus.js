//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    inviteer:[],
    inviteeId:'',
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

console.log(99999)
    //查看是否授权
    wx.getSetting({
      success(res) {
        console.log("授权")
        if (!res.authSetting['scope.userInfo']) {
          console.log(999999776)
          that.login();
        }else{
          console.log(11112233)
          that.login();
          that.getUserInfo();
          that.setData({
            btn_bool:false
          });
        }
      },
      fail(err){
        console.log(err,88888888)
      }

    })
    
  },
  onGotUserInfo:function (e){
    console.log(e,"11111eeeeeee")
    if(e.detail.userInfo){
      this.setData({
        btn_bool:false
      });
      this.getUserInfo();

    }
  },
  //登陆
  login:function(){
    var that = this
    wx.login({
      success: function(res) {
        console.log(res,"登陆成功")
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.KrUrl+'api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res,'登陆接口成功')
              app.globalData.Cookie = res.header['Set-Cookie']||res.header['set-cookie'];
              app.globalData.openid = res.data.data['openid'];
              that.getUserInfo();
              that.detailList();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
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
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/user/save',
          
          data:{
            encryptedData:res.encryptedData,
            iv:res.iv,
          
          },
          success:(res)=>{
            console.log(res,5555888888881111)
            
          }
        })
      },
      fail:function (err){
          console.log(888,err)
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
        console.log(res,"会议状态3333333")
        this.setData({
          meetingTime:res.data.data.meetingTime,
          themeName:res.data.data.theme,
          meetingRoomName:res.data.data.meetingRoomName,
          address:res.data.data.address,
          inviteer:res.data.data.inviteers,
          limitCount:res.data.data.limitCount,
          meetingStatus:res.data.data.meetingStatus||'',
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
