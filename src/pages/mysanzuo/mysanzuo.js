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
  onLoad: function () {
    let that = this;
    // wx.reportAnalytics('viewmeeting')
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    app.getRequest({///krseat//myseat/list
        url:app.globalData.KrUrl+'api/gateway/krseat/myseat/list',
        methods:"GET",
        success:(res)=>{
          wx.hideLoading();
          
          if(res.data.code>0){
            for(let i of res.data.data){
              if(i.seatStatus == 'TOUSE'){
                i.kg = true
              }else{
                i.kg = false
              }
            }
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
          // console.log('请求失败')
        }
      })
  },
})
