//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    meetingList:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/list',
        methods:"GET",
        data:{
          
        },
        success:(res)=>{
          console.log(res)
          that.setData({
            meetingList:res.data.data.items
          })
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
  },
})
