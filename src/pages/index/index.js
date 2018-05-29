//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
    duration: 1000,
    buildingList:[],
    myMeeting:[],
    metting:false,
  },
  rq_data:{
    latitude:'',
    longitude:'',
  },
  //获取地理位置
  getLocation:function(){
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res,"经纬度")
        _this.rq_data = {
          latitude:res.latitude,
          longitude:res.longitude
        };
        wx.setStorage({
          key:"lat_log",
          data: {
            lat_log:{
              latitude:res.latitude,
              longitude:res.longitude
            }
          },
        })
        _this.getAllInfo();
      }
    })
  },
  onLoad: function () {
    

    const that = this;
    this.getLocation();
    //页面加载
    wx.login({
      success: function(res) {
        //console.log(res)
        if (res.code) {
          //发起网络请求
         // console.log(that.globalData.KrUrl,89773737)
          wx.request({
            url: app.globalData.KrUrl+'api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res.header,res.header['Set-Cookie'],'登陆数据')
              app.globalData.Cookie = res.header['Set-Cookie'];
              var openId = res.data.data.openid;
              //console.log(openId)
              that.getAllInfo();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
   /* wx.request({
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
    })*/
    
    //查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
          
    //       wx.authorize({
    //           scope: 'scope.userInfo',
    //           success() {
    //             that.getInfo();
    //             that.getLocation();
    //           },
    //           fail(res){
    //             console.log(res,999)
    //           }
    //       })
    //     }else{
    //       that.getInfo();
    //       that.getLocation();
    //     }
    //   }
    // })
    //获取用户信息
    
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
    that.getInfo();
  },
  getAllInfo:function (){
    var that = this;
    console.log(app,5555,that.data.latitude)
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/home',
      
      data:{
        latitude:that.rq_data.latitude,
        longitude:that.rq_data.longitude
      },
      success:(res)=>{
        console.log(res,888888881111)
        that.setData({
          buildingList:res.data.buildingList,
          myMeeting:res.data.myMeeting
        })
        if(res.data.myMeeting.length>0){
          that.setData({
            metting:true
          })
        }
      }
    });
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
