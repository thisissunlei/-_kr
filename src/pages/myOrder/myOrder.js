

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
        "orderShowStatus":1,
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
        "orderShowStatus":2,
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
        "orderShowStatus":3,
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
        "orderShowStatus":4,
        "orderStatusDesc":"测试内容it12",
        "payStatus":"测试内容58w2"
      },
    ],
    type:'',
    number:'0'
  },
  changeType:function(e){
    console.log('changeType====',e.target.dataset)
    let data = e.target.dataset;
    let type = data.type;
    this.setData({
      number:20*type + '%',
      type:type
    })
  },
  onLoad: function () {
   
  },
})
