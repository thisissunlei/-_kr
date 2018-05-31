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
          console.log('res',res.data.data.items)
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
           console.log('========',res)
        }
      })
  },
})
