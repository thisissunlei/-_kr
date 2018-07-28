//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    meetingList:[],
    bg:'../images/my/bg.png'
  },
  Bright:"",
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
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    app.getRequest({///krseat//myseat/list
        url:app.globalData.KrUrl+'api/gateway/krseat//myseat/list',
        methods:"GET",
        success:(res)=>{
          for(let i of res.data.data){
            if(i.seatStatus == 'TOUSE'){
              i.kg = true
            }else{
              i.kg = false
            }
          }
          wx.hideLoading();
          console.log(res)
          if(res.data.code>0){
            var list = []
            list = res.data.data.map((item,index)=>{
              return item;
            })
            that.setData({
              meetingList:list
            })
          }else{
            that.setData({
              error:false,
              errorMessage:res.data.message
            })
          }
          
        },
        fail:(res)=>{
          wx.hideLoading();
          console.log('请求失败')
        }
      })
  },
})
