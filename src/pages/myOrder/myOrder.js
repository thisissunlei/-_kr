
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
        "meetingTIme":"测试内容pr46111",
        "orderId":1,
        "orderShowStatus":'OBLIGATION',
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
        "orderShowStatus":'OBLIGATION',
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
        "orderShowStatus":'USED',
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
        "orderShowStatus":'CLOSED',
        "orderStatusDesc":"测试内容it12",
        "payStatus":"测试内容58w2"
      },
    ],
    type:'',
    number:'0',
    tabList:{
        'ALL':'0',
        'OBLIGATION':'1',
        'TOBEUSED':'2',
        'USED':'3',
        'CLOSED':'4'
    }
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
    let number = this.data.tabList[type];

    this.setData({
      number:20*number + '%',
      type:type
    },function(){
      that.getData(type)
    })
  },
  onLoad: function (options) {
    let type= options.orderShowStatus;
    let number = this.data.tabList[type];
    this.setData({
      number:20*number + '%',
      type:options.orderShowStatus
    })
    this.getData(type)
  },
  getData:function(type){
    let that = this;
    // this.startcountDate()
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type
        },
        success:(res)=>{
          console.log(res)
          let list = []
          list = that.data.orderList.map((item,index)=>{
            if(item.orderShowStatus == 'OBLIGATION'){
              item.minute='';
              item.second='';
              console.log('=======')
              const time = CAlculagraph.CAlculagraph();
              const that = this;
              time.timerMint({
                deadline:new Date().getTime()/1000+300,//最终结束的时间戳,
                callback:function (){
                  console.log(111)
                },//时间结束
                that:this
              });
            }
            return item;
          })
           console.log('========',list,that.data)

          that.setData({
            orderList:list
          })
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
  }
})
