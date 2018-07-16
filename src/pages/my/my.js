//personal.js
//获取应用实例
const app = getApp()

Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    count:2,
    number:2,
    tipShow:true,
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
    this.getPhone();
    this.getCounts()
    
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
              console.log(res)
              this.setData({
                count:res.data.data.count
              })
        }
    })
  },
  //我的散座的length
  getCounts:function(){
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/count',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
              console.log(res)
              this.setData({
                number:res.data.data.count
              })
        }
    })
  },
 
})
