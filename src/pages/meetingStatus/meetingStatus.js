//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");
var meetingData = require("../../utils/meeting.js");
const app = getApp()

Page({
  data: {
    meetingDetailData:{},
    inviteers:[],
    onShareAppMessage: function() {
      return app.globalData.share_data;
    },
    myjion:true,
    advance:false,
    status:false,
    btn_bool:true,
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
    ],
    phoneDialog: true,
    passwordDialog: false,
    password: ''
  },
  flag:true,
  join:true,
  inviteeId:'',
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    let that = this;
    that.inviteeId = options.inviteeId
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
              setTimeout(function(){
                wx.hideLoading();
              },2000)
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
    var _this=this;
    meetingData.meetingData(this.inviteeId,function(meetingObj){
      _this.setData({
        meetingDetailData:meetingObj.meetingDetailData,
        inviteers:meetingObj.inviteers
      })
      if(_this.data.meetingDetailData.join===true){
        _this.setData({
          myjion:false,
        })
      }
      if(_this.data.meetingDetailData.meetingStatus==='EXPIRED'){
        _this.setData({
          status:true,
          advance:true,
          myjion:false
        })
      }
    },this)
  //   var that = this
  //   app.getRequest({
  //     url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
  //     methods:"GET",
  //     header:{
  //       "content-type":"application/json"
  //     },
  //     data:{
  //       inviteeId:that.inviteeId
  //     },
  //     success:(res)=>{
  //       console.log(that,res,2222222222)
  //       let data = res.data.data
  //       let meetingDetailData = Object.assign({},data)
  //       console.log(meetingDetailData)
  //       this.setData({
  //         meetingDetailData:meetingDetailData,
  //         inviteers:res.data.data.inviteers
  //       })

  //      if(res.data.data.join===true){
  //       that.setData({
  //         myjion:false,
  //       })
  //     }
  //     if(res.data.data.meetingStatus==='EXPIRED'){
  //       that.setData({
  //         status:true,
  //         advance:true,
  //         myjion:false
  //       })
  //     }
  //     }
  //   })
  },
  
  //点击我要参与
  jion:function(){
    var _this = this
    if(_this.flag){
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting//invitee/joinInvitee',
        methods:"GET",
        header:{
          "content-type":"application/json"
        },
        data:{
          inviteeId:_this.inviteeId
        },
        success:(res)=>{
          console.log(res,"确认参加")
          if(res.data.code==1){
            console.log( _this.data.inviteers)
            _this.data.meetingDetailData.inviteers.push(_this.data.wechatInfo)
            _this.data.inviteers.push(_this.data.wechatInfo)
            _this.setData({
              meetingDetailData: _this.data.meetingDetailData,
              inviteers:_this.data.inviteers
            })
            
            _this.flag = false
            if(_this.join===true){
              _this.setData({
                myjion:false,
              })
            }
          console.log(_this.inviteeId,'传到metail的inviteeId11111')
          wx.navigateTo({
            url:'../meetingDetail/meetingDetail?inviteeId='+_this.inviteeId+'&status=1'
          })
          }else{
            wx.showToast({
              title: res.data.message,
              duration: 2000
            })
            if(_this.join===true){
              _this.setData({
                myjion:false,
              })
            }
          }
          
        },
        
        fail:(res)=>{
          _this.flag = true
          _this.setData({
            myjion:true,
          })
        }
      })
      
    }
},
  
  //点击我要预定
  proceed:function(){
    wx.redirectTo({
      url:"../index/index"
    })
  },


  moveToBind() {
    this.setData({
      phoneDialog: false,
    });
    wx.setStorage({
      key: 'bind_phone_url',
      data: '../meetingDetail/meetingDetail?inviteeId=' + this.inviteeId,
      success: (res) => {
        wx.navigateTo({
          url: "../bindPhone/bindPhone?fun=goStorageUrl"
        });
      }
    });
  },

  closeDialog() {
    this.setData({
      phoneDialog: false,
      passwordDialog: false
    })
  },
})
