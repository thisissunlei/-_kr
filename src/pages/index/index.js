//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    btn_bool:true,
    duration: 1000,
    buildingList:[],
    myMeeting:[],
    metting:false,
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
      }
    })
  },
  onLoad: function () {
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
              that.func_bool_l = true;
              that.func_bool_l2 = true;
              app.globalData.Cookie = res.header['Set-Cookie']||res.header['set-cookie'];
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
          console.log(999999776)
          /*wx.authorize({
              scope: 'scope.userInfo',
              success() {
                that.getInfo();
                that.getLocation();
              },
              fail(res){
                console.log(res,999)
              }
          })*/
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
        console.log(res.data.data,888888881111)
        that.setData({
          buildingList:res.data.data.buildingList,
          myMeeting:res.data.data.myMeeting
        })
        if(res.data.data.myMeeting.length>0){
          that.setData({
            metting:true
          })
        }
      }
    });
  },
  //获取用户信息
  getInfo:function(){
    console.log(666666)
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res,888888)   
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
            iv:res.iv
          },
          success:(res)=>{
            console.log(res,5555888888881111)
            
          }
        });
      }
    })
  },

  //点击会议card
  moveToMeetingDetail:function(e){
    console.log(e)
    var  inviteeId=e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../meetingDetail/meetingDetail?inviteeId="+inviteeId
    })
  },
  //点击会议室进入会议室列表
  moveToMeetingRoom:function(e){
    console.log(e)
    var communityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../boardroomList/boardroomList?communityId="+communityId
    })
  },
  //
  moveToMy:function(){
    wx.navigateTo({
      url:"../my/my"
    })
  },

  onGotUserInfo:function (e){
    console.log(e.detail.userInfo,333333)
    if(e.detail.userInfo){
      this.getInfo();
      this.setData({
        btn_bool:false
      });
    }
    
  },

  jumpSubmit(e){
    var target = e.target.dataset;
    var type = target.type;
    console.log(target,'checkWarn',target.type)
    let url = ''
    switch (type){
      case 'telephone':
        url = "../phone/phone?type=submit&value=120"
        break;
      case 'warn':
        url = "../warn/warn?type=submit&value=NOALERT"
        break;
      case 'detail':
        url = "../orderDetail/orderDetail"
      break;
      case 'my':
      url = "../my/my"
      break;
      default:
        url = "../meetingTheme/meetingTheme?type=submit&value=会议"
        break;
      
    } 
    wx.navigateTo({
      url: url
    });
  },
  jumpStorage(e){
    var target = e.target.dataset;
    var type = target.type;
    console.log(target,'checkWarn',target.type)
    let url = ''
    switch (type){
      case 'telephone':
        url = "../phone/phone?type=storage"
        break;
      case 'warn':
        url = "../warn/warn?type=storage"
        break;
      default:
        url = "../meetingTheme/meetingTheme?type=storage"
        break;
    } 
    wx.navigateTo({
      url: url
    });
  },
  bindPhone(){
    wx.navigateTo({
      url: "../bindPhone/bindPhone"
    });
  },
  myOrder(){
    wx.navigateTo({
      url: "../myOrder/myOrder?orderShowStatus=OBLIGATION"
    });
  },
  myMeeting(){
    wx.navigateTo({
      url: "../myMeeting/myMeeting"
    });
  }

})
