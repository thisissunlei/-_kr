//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    onShareAppMessage: function() {
      return app.globalData.share_data;
    },
    myjion:true,
    advance:false,
    status:false,
    inviteer:[],
    inviteeId:'',
    btn_bool:true,
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
  flag:true,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
 
  onLoad: function (options) {
    wx.reportAnalytics('viewinvitation')
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
            },
            fail:function(res){
              console.log(res,8888887777)
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
       console.log(new Date(),res.data.data.join)
        if(this.data.join===true){
          this.setData({
            myjion:false,
          })
        }
        if(res.data.data.meetingStatus==='EXPIRED'){
          this.setData({
            status:true,
            advance:true,
            myjion:false
          })
        }
      }
    })
  },
  
  //点击我要参与
  jion:function(){
    var _this = this
        wx.reportAnalytics('Accept Invitation')
    
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
          _this.setData({
            join:true
          })
          _this.flag = false
          console.log(_this.data.join,'点击后')
          if( _this.data.join===true){
            _this.setData({
              myjion:false,
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
