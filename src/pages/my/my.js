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
  jumpMyMeet:function() {
    wx.navigateTo({
      url: '../myMeeting/myMeeting'
    })
  },
  jumpOderList:function(e){
    let status=e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../myOrder/myOrder?orderShowStatus='+status
     })
  },
  closeTip:function(){
    this.setData({
      tipShow:!this.data.tipShow
    })
  },
  onLoad: function () {
    this.getCount();
    this.getPhone()
   
    
  },
  getPhone:function(){

    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/getWecharUser',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          let userInfo=Object.assign({},res.data.data);
              userInfo.phone=this.changePhone(userInfo.phone)
            this.setData({
                userInfo:userInfo
            })
        }
    })
  },
  getCount:function(){
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/count',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
              console.log(res)
              this.setData({
                count:res.data.data.count
              })
        }
    })
  },

  changePhone:function(phone){
    phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return  phone;
  }
})
