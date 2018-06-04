//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    myjion:'',
    advance:'',
    status:'',
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
  flag:true,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
 
  onLoad: function (options) {
    const that = this;
    let inviteeId = options.inviteeId
    this.setData({
      inviteeId:inviteeId
    });
    
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.login();
        }else{
          that.login();
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
              console.log(app.globalData.Cookie,'cookie')
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
    let that = this
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
        console.log(res,2222222222)
        this.setData({
          meetingTime:res.data.data.meetingTime||'',
          themeName:res.data.data.theme||'',
          meetingRoomName:res.data.data.meetingRoomName||'',
          address:res.data.data.address||'',
          inviteer:res.data.data.inviteers||[],
          limitCount:res.data.data.limitCount||'',
          meetingStatus:res.data.data.meetingStatus||'',
          join:res.data.data.join||''
        })
        console.log(res.data.data.meetingStatus)
        if(res.data.data.meetingStatus==='EXPIRED'){
          this.setData({
            status:true,
            advance:true
          })
        }else{
          this.setData({
            status:false,
            advance:false
          })
        }
      }
    })
  },
  
  //点击我要参与
  jion:function(){
    console.log(this.flag)
    var _this = this
    if(_this.flag){
      this.data.inviteer.push(this.data.wechatInfo)
      this.setData({
        inviteer:this.data.inviteer
      })
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting//invitee/joinInvitee',
        methods:"GET",
        header:{
          "content-type":"application/json"
        },
        data:{
          inviteeId:this.data.inviteeId
        },
        success:(res)=>{
          console.log(res,"确认参加")
          _this.flag = false
          console.log(this.data.join,'join')
          if( _this.data.join==='true'){
            _this.setData({
              myjion:false,
            })
          }else{
            _this.setData({
              myjion:true,
            })
          }
        },
        fail:(res)=>{
          _this.flag = true
        }
      })
      
    }
},
  
  //点击我要预定
  proceed:function(){
    wx.redirectTo({
      url:"../index/index"
    })
  }
})
