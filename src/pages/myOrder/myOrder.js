
import * as CAlculagraph from '../../utils/time.js';

const app = getApp()
Page({
  data: {
    minute:'',
    second:'',
    error:true,
    errorMessage:'',
    orderList:[],
    list:[
      {
        "buildName":"测试内容6n27",
        "capacity":"20",
        "ctime":new Date().getTime()/1000+300,
        "imgUrl":"测试内容5s1e",
        "meetingRoomName":"测试内容sdqr",
        "meetingTIme":"测试内容pr46111",
        "orderId":1,
        "orderShowStatus":'OBLIGATION',
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
  dealTime(e){
    var dates=new Date();
    var nowtime=Math.round(e-dates.getTime()/1000);
    var minute=Math.floor(((nowtime%86400)%3600)/60);
    var second=Math.floor(((nowtime%86400)%3600)%60);
    return {
      minute:minute,
      second:second
    }
  },
  getData:function(type){
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type
        },
        success:(res)=>{
          console.log('res',res.data.data.items)
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                let time = this.dealTime(item.expiredTime)
                item.minute=time.minute;
                item.second=time.second;
              }
              return item;
            })
            that.setData({
              orderList:[]
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
  orderPay(e){
    let id = e.target.dataset.order;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
        methods:"GET",
        data:{
          orderId:id
        },
        success:(res)=>{
          console.log('res',res)
          if(res.data.code>0){

          }else{

            // that.setData({
            //   error:false,
            //   errorMessage:res.data.message
            // })
          }
          
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
  }
})
