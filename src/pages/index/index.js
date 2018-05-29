//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    latitude:'',
    longitude:'',
    duration: 1000,
    buildingList:[],
    myMeeting:[],
    metting:false,
    user_info:{
      
    },
  },
  //获取地理位置
  getLocation:function(){

  },
  onLoad: function () {
    //页面加载
    wx.request({
      url:'https://www.easy-mock.com/mock/5b0958295c37757453191ee5/kr/home',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        "latitude":"39.92",
        "longitude":"116.46"
      },
      success:(res)=>{
        this.setData({
          buildingList:res.data.buildingList,
          myMeeting:res.data.myMeeting
        })
        
        if(res.data.myMeeting.length>0){
          this.setData({
            metting:true
          })
        }
      }
    }),
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://itest01.krspace.cn/api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res,'登陆数据')
              var openId = res.data.data.openid;
              console.log(openId)
             
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }),
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log(res,1444441111)
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
              scope: 'scope.userInfo',
              success() {
                  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                  // wx.startRecord()
              }
          })
        }
      }
  })
  wx.getUserInfo({
    success: function(res) {
      console.log(res.userInfo,888888)
      wx.setStorage({
        key:"user_info",
        data: {
          user_info:res.userInfo
        },
      })
      wx.request({
        url:'http://itest01.krspace.cn/api/gateway/krmting/common/login'
      })
    }
  })
  },
  
  
  // GetHeadImg(){
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },

  //点击会议card
  moveToMeetingDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.request({
      url:" api/gateway/krmting/invitee/detail",
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        id : id
      },
      success:(res)=>{

      }
    })
    
  }
  
})
