


const app = getApp()
import * as CAlculagraph from '../../utils/time.js'
Page({
  data: {
    orderList:[],
    orderseatList:[],
    minute:'',
    second:'',
    error:true,
    errorMessage:'',
    page:1,
    orderOldList:[],
    totalPages:0,
    type:'',
    list:[],
    number:'0',
    tabList:{
        'ALL':'0',
        'OBLIGATION':'1',
        'TOBEUSED':'2',
        'USED':'3',
        'CLOSED':'4'
    },
    push:[
      {
        buildName:"散座测试兆泰国际中心 3层",
        capacity:"5",
        cost:"30.00",
        ctime:1531459166000,
        expiredTime:1531459466000,
        floor:"3",
        imgUrl:"https://img.krspace.cn/app/common/public/img/0/2018/06/07/222205529lWfkuRH.jpg",
        meetingRoomName:"3H",
        meetingTIme:"07-13(周五)   18:30-19:00",
        orderId:187,
        orderShowStatus:"OBLIGATION",
        orderStatusDesc:"待支付",
        payStatus:"OBLIGATION"
      },
      {
        buildName:"散座2测试兆泰国际中心 3层",
        capacity:"5",
        cost:"30.00",
        ctime:1531459166000,
        expiredTime:1531459466000,
        floor:"3",
        imgUrl:"https://img.krspace.cn/app/common/public/img/0/2018/06/07/222205529lWfkuRH.jpg",
        meetingRoomName:"3H",
        meetingTIme:"07-13(周五)   18:30-19:00",
        orderId:187,
        orderShowStatus:"TOBEUSED",
        orderStatusDesc:"带使用",
        payStatus:"OBLIGATION"
      },
      {
        buildName:"散座3测试兆泰国际中心 3层",
        capacity:"5",
        cost:"30.00",
        ctime:1531459166000,
        expiredTime:1531459466000,
        floor:"3",
        imgUrl:"https://img.krspace.cn/app/common/public/img/0/2018/06/07/222205529lWfkuRH.jpg",
        meetingRoomName:"3H",
        meetingTIme:"07-13(周五)   18:30-19:00",
        orderId:187,
        orderShowStatus:"USED",
        orderStatusDesc:"已完成",
        payStatus:"OBLIGATION"
      },
      {
        buildName:"散座4测试兆泰国际中心 3层",
        capacity:"5",
        cost:"30.00",
        ctime:1531459166000,
        expiredTime:1531459466000,
        floor:"3",
        imgUrl:"https://img.krspace.cn/app/common/public/img/0/2018/06/07/222205529lWfkuRH.jpg",
        meetingRoomName:"3H",
        meetingTIme:"07-13(周五)   18:30-19:00",
        orderId:187,
        orderShowStatus:"CLOSED",
        orderStatusDesc:"已取消",
        payStatus:"OBLIGATION"
      }
    ],
    toView: 'red',
    scrollTop: 0,
    page:1
  },
  //请求条数
  lower: function(e) {
    console.log(this.data.totalPages)
    // console.log('lower',e)
    let type=this.data.type;
    let page = ++this.data.page;//1,2,3,...
    let totalPages = this.data.totalPages;
    console.log(this.data.orderOldList.length,10*page)
    if(page>totalPages){
      return
    }else{
      this.getData(type,page)
      this.getData1(type,page)
    }
    
    
  },
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  //点击传参
  changeType:function(e){
    // console.log(e)
    let that = this;
    let data = e.target.dataset;
    let type = data.type;
    let number = this.data.tabList[type];

    this.setData({
      number:20*number + '%',
      type:type,
      page:1,
      orderList:[],
      orderseatList:[],
      orderOldList:[]
    },function(){
      that.getData(type,1)
      that.getData1(type,1)
    })
  },
  //初始化加载
  onLoad: function (options) {
    
    console.log(options)
    let type= options.orderShowStatus;
    let number = this.data.tabList[type];
    this.setData({
      number:20*number + '%',
      type:options.orderShowStatus
    })
    this.getData(type)
    this.getData1(type)
  },
  //页面重复加载
  onShow: function (options) {
    this.setData({
      orderOldList:[],
      orderList:[],
      orderseatList:[],
      page: 1,
      totalPages:0
    })
    this.getData()
    this.getData1()

  },
  //倒计时
  dealTime(e){
    var dates=new Date();
    var nowtime=Math.round(e-dates.getTime());
    var minute=Math.floor(nowtime/(60*1000))
    var leave3=nowtime%(60*1000)      //计算分钟数后剩余的毫秒数  
    var second=Math.round(leave3/1000)
    return {
      minute:minute,
      second:second
    }
  },
  //请求会议列表数据
  getData:function(type,page){
    let that = this;
    type = type || this.data.type;
    let orderOldList = this.data.orderList;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1,
        },
        success:(res)=>{
          console.log(res)
          let oldList = []
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                let time = this.dealTime(item.expiredTime)
                item.minute=time.minute;
                item.second=time.second;
              }
              console.log('=item.minute>-1',item.minute>-1,item.minute)
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
  //请求散客
  getData1:function(type,page){
    let that = this;
    type = type || this.data.type;
    let orderseatOldList = this.data.orderseatList;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1,
          pageSize:3
        },
        success:(res)=>{
          console.log("散客订单列表",res)
          let seatoldList = []
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                let time = this.dealTime(item.expiredTime)
                item.minute=time.minute;
                item.second=time.second;
              }
              console.log('=item.minute>-1',item.minute>-1,item.minute)
              return item;
            })
            var allList = [].concat(orderseatOldList,list)
            console.log(list.length,'totalCount',allList,allList.length)
            that.setData({
              orderseatOldList:allList,
              orderseatList:allList,
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
  //在线支付
  orderPay(e){
   console.log(e)
    let id = e.target.dataset.order;
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
        methods:"GET",
        data:{
          orderId:id
        },
        success:(res)=>{
          console.log('res',res)
          if(res.data.code>0){
             // wx.reportAnalytics('confirmorder')
            wx.requestPayment({
              'timeStamp': res.data.data.timestamp,
              'nonceStr': res.data.data.noncestr,
              'package': res.data.data.packages,
              'signType':res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success':function(res){
                that.getInviteeId(id)
              },
              'fail':function(res){
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id='+id 
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '../orderseatDetail/orderseatDetail?id='+id 
            })

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
  },
  getInviteeId(orderId){
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        orderId:orderId
      },
      success:(res)=>{
          wx.navigateTo({
            url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
          })
      }
    })
    
  },
})
