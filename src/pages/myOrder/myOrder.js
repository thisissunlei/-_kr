const app = getApp()
import * as CAlculagraph from '../../utils/time.js'
Page({
  data: {
    con:1,
    show_xx:false,
    orderList:[],
    orderList1:[],
    minute:'',
    second:'',
    error:true,
    errorMessage:'',
    page:1,
    orderOldList:[],
    order:'',
    totalPages:0,
    type:'',
    list:[],
    number:'0',
    tabList:{
        'ALL':'0',
        'OBLIGATION':'1',
        'TOUSE':'2',
        'USED':'3',
        'CLOSED':'4'
    },
    push:[],
    toView: 'red',
    scrollTop: 0,
    page:1
  },
  orderOldList1:[],
  //请求条数
  lower: function(e) {
    console.log(this.data.totalPages)
    // console.log('lower',e)
    let type=this.data.type;
    let page = ++this.data.page;//1,2,3,...
    let totalPages = this.data.totalPages;
    console.log(totalPages)
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
    console.log(number)
    this.setData({
      number:20*number + '%',
      type:type,
      page:1,
      orderList:[],
      orderOldList:[],
      orderList1:[],
      orderOldList1:[]
    },function(){
      that.getData(type,1)
      that.getData1(type,1)
    })
  },
  //初始化加载
  onLoad: function (options) {
    // console.log(options)
    let type= options.orderShowStatus;
    let number = this.data.tabList[type];
    this.setData({
      number:20*number + '%',
      type:options.orderShowStatus
    })
    this.getData(type)
    this.getData1(type)
  },
  sanzuo(){
    this.setData({
      show_xx:false
    })
  },
  huiyi(){
    this.setData({
      show_xx:true
    })
  },
  //页面重复加载
  onShow: function (options) {
    this.setData({
      orderOldList:[],
      orderList:[],
      orderOldList1:[],
      orderList1:[],
      page: 1,
      totalPages:0
    })
    this.getData()
    this.getData1()
  },
  //倒计时
  dealTime(e){
    console.log(e)
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
    console.log(orderOldList)
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1,
        },
        success:(res)=>{
          console.log (res)
          let oldList = []
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                console.log(item.expiredTime)
                let time = this.dealTime(item.expiredTime)
                console.log(time)
                
                item.minute=time.minute;
                item.second=time.second;
                
              }
              // console.log('=item.minute>-1',item.minute>-1,item.minute)
              return item;
            })
            console.log(res)
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
  //散座订单列表
  getData1:function(type,page){
    let that = this;
    type = type || this.data.type;
    let orderOldList1 = this.data.orderList1;//[]
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1,
          pageSize:10
        },
        success:(res)=>{
          console.log(res)
          let oldList = []
          if(res.data.code>0){
            var list1 = []
            list1 = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                let time = that.dealTime(item.expiredTime)
                item.minute=time.minute;
                item.second=time.second;
              }
              console.log('=item.minute>-1',item.minute>-1,item.minute,item.second)
              return item;
            })
            var allList1 = [].concat(orderOldList1,list1)
            this.orderOldList1 = allList1
            that.setData({
              orderOldList1:allList1,
              orderList1:allList1,
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
                  url: '../orderDetail/orderDetail?id='+id +'&con='+1
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '../orderDetail/orderDetail?id='+id +'&con='+1
            })

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
  orderPay1(e){
    console.log(e)
    this.setData({
      orderId:e.currentTarget.dataset.order
    })
    let data_a = wx.getStorageSync('order-info')
    let orderId= e.currentTarget.dataset.order
    console.log(orderId)
    console.log(data_a,orderId)
    let data = null
    data_a.map((item,index)=>{
      if(item.orderId == orderId){
        data = item
      }
    })
    console.log(data)
    wx.requestPayment({
      'timeStamp': data.timestamp,
      'nonceStr': data.noncestr,
      'package': data.packages,
      'signType':data.signType,
      'paySign': data.paySign,
      'success':function(res){
        wx.navigateTo({
          url: '../orderseatDetail/orderseatDetail?id='+orderId 
        })
      },
      'fail':function(res){
        console.log(res,1111111)
        wx.navigateTo({
          url: '../orderseatDetail/orderseatDetail?id='+orderId 
        })
      }
    })

   },
  // getInviteeId(orderId){
  //   app.getRequest({
  //     url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
  //     methods:"GET",
  //     header:{
  //       'content-type':"appication/json"
  //     },
  //     data:{
  //       orderId:orderId
  //     },
  //     success:(res)=>{
  //       console.log(res)
  //         wx.navigateTo({
  //           url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
  //         })
  //     }
  //   })
    
  // },

  
})
