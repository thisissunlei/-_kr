//personal.js
//获取应用实例
const app = getApp()

Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    con:1,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    count:0,
    number:0,
    tipShow:true,
    activityCount:0,
  },
  mysan(){
    wx.navigateTo({
      url: '../mysanzuo/mysanzuo'
    })
  },
  jumpMyMeet:function() {
    wx.navigateTo({
      url: '../myMeeting/myMeeting'
    })
  },
  jumpMyActivityt:function(){
    wx.navigateTo({
      url: '../pages/myActivity/myActivity'
    })
  },
  jumpOderList:function(e){
    let status=e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../myOrder/myOrder?orderShowStatus='+status+'&con='+1
     })
  },
  closeTip:function(){
    this.setData({
      tipShow:!this.data.tipShow
    })
  },
  onLoad: function () {
    this.getCount();
    this.getPhone();
    this.getCounts()
    this.getActivityCount();
    
  },
  getPhone:function(){

    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/getWecharUser',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          // console.log(res)
          let userInfo=Object.assign({},res.data.data);
          // console.log(userInfo)
              userInfo.phone=userInfo.phone
            this.setData({
                userInfo:userInfo
            })
        }
    })
  },
  //我的会议的length
  getCount:function(){
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/count',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          // console.log(res)
            this.setData({
              count:res.data.data.count
            })
        }
    })
  },
  //我的散座的length
  getCounts:function(){
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/myseat/remainingCount',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          // console.log(res)
          this.setData({
            number:res.data.data
          })
        }
    })
  },
  getActivityCount:function(){
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/kmactivity/my/remaing/count',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
            this.setData({
              activityCount:res.data.data
            })
        }
    })
  },
 
})
