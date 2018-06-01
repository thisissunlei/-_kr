
import * as CAlculagraph from '../../utils/time.js';

const app = getApp()
Page({
  data: {
    minute:'',
    second:'',
    error:true,
    errorMessage:'',
    orderList:[],
    page:1,
    orderOldList:[],
    totalPages:0,
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
    },
    toView: 'red',
    scrollTop: 0,
    page:1
  },
  lower: function(e) {
    console.log('lower',e)
    let type=this.data.type;
    let page = ++this.data.page;
    let totalPages = this.data.totalPages;
    console.log(this.data.orderOldList.length,10*page)
    if(page>totalPages){
      return
    }else{
      this.getData(type,page)
    }
    
    
  },

  changeType:function(e){
    let that = this;
    let data = e.target.dataset;
    let type = data.type;
    let number = this.data.tabList[type];

    this.setData({
      number:20*number + '%',
      type:type,
      page:1,
      orderList:[],
      orderOldList:[]
    },function(){
      that.getData(type,1)
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
  getData:function(type,page){
    let that = this;
    let orderOldList = this.data.orderList;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1
        },
        success:(res)=>{
          console.log('res',res.data.data.items)
          let oldList = []
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
            var allList = [].concat(orderOldList,list)
            console.log(list.length,'totalCount',allList,allList.length)
            that.setData({
              orderOldList:allList,
              orderList:allList,
              page:page || 1,
              totalPages:res.data.data.totalPages
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
            wx.requestPayment({
              'timeStamp': res.data.data.timestamp,
              'nonceStr': res.data.data.noncestr,
              'package': res.data.data.packages,
              'signType':res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success':function(res){
                console.log(res)
                wx.navigateTo({
                  url: '../paySuccess/paySuccess?inviteeId='+data.inviteeId
                })
              },
              'fail':function(res){
                wx.navigateTo({
                  url: '../orderDetail/orderDetail?id='+data.orderId
                })
              }
            })
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
