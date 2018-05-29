
import * as CAlculagraph from '../../utils/time.js';

const app = getApp()
Page({
  data: {
    minute:'',
    second:'',
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
  startcountDate:function(){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:new Date().getTime()/1000+300,//最终结束的时间戳,
      callback:function (){
        console.log(111)
      },//时间结束
      that:this
    });
  },
  changeType:function(e){
    let that = this;
    let data = e.target.dataset;
    let type = data.type;
    this.setData({
      number:20*type + '%',
      type:type
    },function(){
      that.getData(type)
    })
  },
  onLoad: function () {
    this.getData('0')
  },
  getData:function(type){
    let that = this;
    this.startcountDate()
    wx.request({
        url:app.globalData.KrUrl+'/api/gateway/krmting/order/list',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        data:{
          orderShowStatus:type
        },
        success:(res)=>{
          console.log(res)
          // that.setData({
          //   orderList:res.data
          // })
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
  }
})
