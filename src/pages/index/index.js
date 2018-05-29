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
  },
  //获取地理位置
  getLocation:function(){
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res,"经纬度")
        _this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        wx.setStorage({
          key:"lat_log",
          data: {
            lat_log:{
              latitude:res.latitude,
              longitude:res.longitude
            }
          },
        })
      }
    })
  },
  onLoad: function () {
    this.getLocation()
    //页面加载
    wx.request({
      url:'https://www.easy-mock.com/mock/5b0958295c37757453191ee5/kr/home',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        latitude:this.latitude,
        longitude:this.longitude
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
        //console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://itest01.krspace.cn/api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              //console.log(res,'登陆数据')
              var openId = res.data.data.openid;
              //console.log(openId)
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
        if (!res.authSetting['scope.userInfo','scope.userLocation']) {
          wx.authorize({
              scope: 'scope.userInfo',
              success() {
                console.log(res,'2223333')
                  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                  // wx.getUserInfo()
              }
          })
        }
      }
    })
    //获取用户信息
    this.getInfo();
    //传信息给后台
    // wx.request({
    //   url:'http://itest01.krspace.cn/api/gateway/krmting/user/save',
    //   methods:"POST",
    //   header:{
    //     'content-type':"appication/json"
    //   },
    //   data:{
        
    //   },
    // })
  },
  //获取用户信息
  getInfo:function(){
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res.userInfo,888888)   
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
        })
        //保存到storage里
        wx.setStorage({
          key:"user_info",
          data: {
            user_info:res.userInfo
          },
        })
      }
    })
  },

  //点击会议card
  moveToMeetingDetail:function(e){
    console.log(e)
    var inviteeId = e.currentTarget.dataset.inviteeId
    wx.navigateTo({
      url:"../meetingDetail/meetingDetail?inviteeId="+inviteeId
    })
  },
  //点击会议室进入会议室列表
  moveToMeetingRoom:function(e){
    console.log(e)
    var communityId = e.currentTarget.dataset.communityId
    wx.navigateTo({
      url:"../boardroomList/boardroomList?communityId="+communityId
    })
  }
})
