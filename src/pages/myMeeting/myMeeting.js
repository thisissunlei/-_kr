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
  onLoad: function () {
    let that = this;
    wx.reportAnalytics('viewmeeting')
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/list',
        methods:"GET",
        data:{
          pageSize:100
        },
        success:(res)=>{
          
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
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
          //  console.log('========',res)
        }
      })
  },
})
