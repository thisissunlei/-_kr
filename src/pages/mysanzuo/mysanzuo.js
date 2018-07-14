//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    meetingList:[
      { address:"北京市朝阳区朝外西街3号兆泰国际中心C座",
        arrvingCount:0,
        id:82182,
        join:false,
        meetingRoomName:"兆泰国际中心 3层 (氪空间) | 3I会议室",
        meetingStatus:"WAIT",
        meetingTime:"07-13(今天)   18:30-19:00",
        orderId:0,
        qrCodeUrl:"",
        theme:"0713会议"
      },
      { address:"北京市朝阳区朝外西街3号兆泰国际中心C座",
      arrvingCount:0,
      id:82182,
      join:false,meetingRoomName:"兆泰国际中心 3层 (氪空间) | 3I会议室",
      meetingStatus:"ARRVING",
      meetingTime:"07-13(今天)   18:30-19:00",
      orderId:0,
      qrCodeUrl:"",
      theme:"0713会议"
    }
    ],
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
    // let that = this;
    // wx.reportAnalytics('viewmeeting')
    // app.getRequest({
    //     url:app.globalData.KrUrl+'api/gateway/krmting/invitee/list',
    //     methods:"GET",
    //     data:{
    //       pageSize:100
    //     },
    //     success:(res)=>{
    //       console.log('res',res.data.data.items)
    //       if(res.data.code>0){
    //         var list = []
    //         list = res.data.data.items.map((item,index)=>{
    //           return item;
    //         })
    //         that.setData({
    //           meetingList:list
    //         })
    //       }else{
    //         that.setData({
    //           error:false,
    //           errorMessage:res.data.message
    //         })
    //       }
          
    //     },
    //     fail:(res)=>{
    //        console.log('========',res)
    //     }
    //   })
  },
})
