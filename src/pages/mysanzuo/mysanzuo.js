//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    meetingList:[],
    bg:'../images/my/bg.png'
  },
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    // wx.reportAnalytics('viewmeeting')
    app.getRequest({///krseat//myseat/list
        url:app.globalData.KrUrl+'api/gateway/krseat//myseat/list',
        methods:"GET",
        success:(res)=>{
          console.log(res)
          if(res.data.code>0){
            var list = []
            list = res.data.data.map((item,index)=>{
              return item;
            })
            that.setData({
              meetingList:list
            })
            console.log(this.data.meetingList)
          }else{
            that.setData({
              error:false,
              errorMessage:res.data.message
            })
          }
          
        },
        fail:(res)=>{
          console.log('请求失败')
        }
      })
  },
})
