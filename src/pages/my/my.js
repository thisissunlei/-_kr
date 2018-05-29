//personal.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    count:0,
    tipShow:true,
  },
  //事件处理函数
  jumpMyMeet:function() {
    wx.navigateTo({
      url: '../myMeeting/myMeeting'
    })
  },
  closeTip:function(){
    this.setData({
      tipShow:!this.data.tipShow
    })
  },
  onLoad: function () {
    this.getCount()
    let info=wx.getStorageSync('user_info');
    let userInfo=Object.assign({},info.user_info);
    //userInfo.phone='15210095787';
    if(userInfo.phone){
      userInfo.phone=this.changePhone(userInfo.phone)
    } 
   
    console.log('userInfo',userInfo)
    this.setData({
      userInfo:userInfo
    })

    
  },
 
  getCount:function(){
    wx.request({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/count',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
              console.log(res)
              this.setData({
                count:res.data.count
              })
        }
    })
  },
  changePhone:function(phone){
    phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return  phone;
  }
})
