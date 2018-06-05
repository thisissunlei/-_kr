//index.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function() {
    wx.reportAnalytics('share')
    return app.globalData.share_data;
  },
  
  data: {
    indicatorDots:true,
    metting:false,
    btn_bool:true,
    duration: 1000,
    buildingList:[],
    myMeeting:[],
  },
  rq_data:{
    latitude:'',
    longitude:'',
  },
  func_bool_g:false,
  func_bool_l:false,
  func_bool_l2:false,
  func_bool_s:false,
  //获取地理位置
  getLocation:function(){
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
        });
        _this.func_bool_g = true;
        if(_this.func_bool_g&&_this.func_bool_l){
          _this.func_bool_g = false;
          _this.func_bool_l = false;
          _this.getAllInfo();
        }
      },
      fail:function(res){
        _this.getAllInfo();
      }
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    const that = this;
    this.getLocation();
    //页面加载
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
              wx.hideLoading();
              that.func_bool_l = true;
              that.func_bool_l2 = true;
              app.globalData.Cookie = res.header['Set-Cookie']||res.header['set-cookie'];
              app.globalData.openid = res.data.data['openid'];
              if(that.func_bool_g&&that.func_bool_l){
                that.func_bool_g = false;
                that.func_bool_l = false;
                that.getAllInfo();
              }
              if(that.func_bool_l2&&that.func_bool_s){
                that.func_bool_s = false;
                that.func_bool_l2 = false;

                that.getInfo();
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }

    }),
    
  //  wx.request({
  //     url:'https://www.easy-mock.com/mock/5b0bf5b41725f034fca4cc78/kr/mettingdetail/home',
  //     methods:"GET",
  //     header:{
  //       'content-type':"appication/json"
  //     },
  //     data:{
  //       latitude:this.rq_data.latitude,
  //       longitude:this.rq_data.longitude
  //     },
  //     success:(res)=>{
  //       this.setData({
  //         buildingList:res.data.buildingList,
  //         myMeeting:res.data.myMeeting
  //       })
  //       if(res.data.myMeeting.length>0){
  //         this.setData({
  //           metting:true

  //         })
  //       }
  //     }
  //   })
    
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('用户没有授权：用户信息！')
        }else{
          that.func_bool_s = true;
          if(that.func_bool_s&&that.func_bool_l2){
            that.func_bool_s = false;
            that.func_bool_l2 = false;

            that.getInfo();
          }
          
          that.setData({
            btn_bool:false
            
          });
        }
      }
    })
    
  },
  onShow:function(){
    this.getAllInfo(this.rq_data.latitude,this.rq_data.longitude)
  },
  getAllInfo:function (){
    var that = this;
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/home',
      data:{
        latitude:that.rq_data.latitude,
        longitude:that.rq_data.longitude
      },
      success:(res)=>{
        let buildingList = res.data.data.buildingList
        let myMeeting = res.data.data.myMeeting
        buildingList.forEach(element => {
          if(element.distance>1000){
            element.distance = (element.distance/1000).toFixed(1)+'km' 
          }else{
            element.distance = element.distance+'m'
          }
          
        });
        that.setData({
          buildingList:res.data.data.buildingList,
          myMeeting:res.data.data.myMeeting,
        })
       console.log(this.data.myMeeting)
        if(this.data.myMeeting.length<0){
          that.setData({
            metting:false
          })
        }else{
          that.setData({
            metting:true
          })
        }
          
        
        console.log(that.data.metting)
      }
    });
  },
  //获取用户信息
  getInfo:function(){
    var that = this;
    wx.getUserInfo({
      success: function(res) { 
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
        })
        //保存到storage里
        wx.setStorage({
          key:"user_info",
          data: {
            user_info:res.userInfo
          },
        });
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/user/save',
          
          data:{
            encryptedData:res.encryptedData,
            iv:res.iv,
          
          },
          success:(res)=>{
            
          }
        });
      }
    })
  },
  //跳转新人指导
  point:function(){
    wx.reportAnalytics('click')
    wx.navigateTo({
      url:"../point/point"
    })
  },
  //点击会议card
  moveToMeetingDetail:function(e){
    var  inviteeId=e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../meetingDetail/meetingDetail?inviteeId="+inviteeId
    })
  },
  //点击会议室进入会议室列表
  moveToMeetingRoom:function(e){
    var communityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../boardroomList/boardroomList?communityId="+communityId
    })
  },
  //
  moveToMy:function(){
    wx.reportAnalytics('click')
    wx.navigateTo({
      url:"../my/my"
    })
  },

  onGotUserInfo:function (e){
    if(e.detail.userInfo){
      this.getInfo();
      this.setData({
        btn_bool:false
      });
    }
    
  },


})
