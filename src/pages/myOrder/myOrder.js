

const app = getApp()
Page({
  data: {
    orderList:[
      {
        "buildName":"测试内容6n27",
        "capacity":"20",
        "ctime":{},
        "imgUrl":"测试内容5s1e",
        "meetingRoomName":"测试内容sdqr",
        "meetingTIme":"测试内容pr46",
        "orderId":28646,
        "orderShowStatus":38605,
        "orderStatusDesc":"测试内容it12",
        "payStatus":"测试内容58w2"
      },
      {
        "buildName":"测试内容6n27",
        "capacity":"20",
        "ctime":{},
        "imgUrl":"测试内容5s1e",
        "meetingRoomName":"测试内容sdqr",
        "meetingTIme":"测试内容pr46",
        "orderId":28646,
        "orderShowStatus":38605,
        "orderStatusDesc":"测试内容it12",
        "payStatus":"测试内容58w2"
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
   
  },
})
