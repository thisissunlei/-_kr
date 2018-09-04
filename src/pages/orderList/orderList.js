const app = getApp()

Page({
  data: {
    tabList:{
        'ALL':'0',
        'OBLIGATION':'1',
        'TOUSE':'2',
        'USED':'3',
        'CLOSED':'4'
    },
    type:'ALL',
    number:0,
    orderType:'seat',
    orderList:[],
    loading:true
  },
  page:1,
  totalPages:0,
  //倒计时
  dealTime(e){
    // console.log(e)
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
  //点击传参
  changeType:function(e){
    let that = this;
    let listType = this.data.orderType;
    let data = e.target.dataset;
    let type = data.type;
    let number = this.data.tabList[type];
    this.setData({
      number:20*number + '%',
      type:type,
      orderList:[],
      loading:true,
    },function(){
      that.page = 1
      if(listType === 'meeting'){
        that.getOrderList(type,1)
      }else{
        that.getSeatList(type,1)
      }
    })
  },
  changeOrderType:function(e){
    let that = this;
    let statusType = this.data.type;
    let data = e.target.dataset;
    let type = data.name;
    this.setData({
      orderType:type,
      orderList:[],
      loading:true,
    },function(){
      that.page = 1
      if(type === 'meeting'){
        that.getOrderList(statusType,1)
      }else{
        that.getSeatList(statusType,1)
      }
    })

  },
  //初始化加载
  onLoad: function (options) {
    let type= options.orderShowStatus;
    let number = this.data.tabList[type];
    this.setData({
      number:20*number + '%',
      type:options.orderShowStatus
    })
    wx.showLoading({
          title: "加载中",
          mask: true
      })
    console.log('onLoad=====',listType)
    let listType = this.data.orderType;
      if(listType === 'meeting'){
        this.getOrderList(type,1)
      }else{
        this.getSeatList(type,1)
      }

  },

  onReachBottom: function(e) {
    let type=this.data.type;
    let listType = this.data.orderType;

    if(this.page>=this.totalPages){
      return
    }else{
      let page = ++this.page;
      if(listType === 'meeting'){
        this.getOrderList(type,page)
      }else{
        this.getSeatList(type,page)
      }
    }
    
    
  },
  
  //请求会议列表数据
  getOrderList:function(type,page){
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
          let oldList = []
           wx.hideLoading();
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
            console.log('getList',orderOldList,list,allList)
            that.setData({
              orderList:allList,
              loading:false
            })
            that.page = page || 1;
            that.totalPages = res.data.data.totalPages
          }else{
            that.setData({
              error:false,
              errorMessage:res.data.message
            })
          }
        },
        fail:(res)=>{
        }
      })
  },
  //散座订单列表
  getSeatList:function(type,page){
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let that = this;
    type = type || this.data.type;
    let orderOldList = this.data.orderList;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/list',
        methods:"GET",
        data:{
          orderShowStatus:type,
          page:page || 1,
          pageSize:10
        },
        success:(res)=>{
          wx.hideLoading();
          let oldList = []
          if(res.data.code>0){
            var list = []
            list = res.data.data.items.map((item,index)=>{
              if(item.orderShowStatus == 'OBLIGATION'){
                let time = that.dealTime(item.expiredTime)
                item.minute=time.minute;
                item.second=that.getzf(time.second);
              }
              return item;
            })
            var allList = [].concat(orderOldList,list)
            this.orderOldList = allList
            that.setData({
              orderList:allList,
              loading:false

            })
            console.log('orderList',allList)
            that.page = page || 1;
            that.totalPages = res.data.data.totalPages

          }else{
            that.setData({
              error:false,
              errorMessage:res.data.message
            })
          }
        },
        fail:(res)=>{
          wx.hideLoading();
        }
      })
  },
  //在线支付
  orderPay(e){
    let id = e.target.dataset.order;
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
        methods:"GET",
        data:{
          orderId:id
        },
        success:(res)=>{
          // console.log('res',res)
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
          //  console.log('========',res)
        }
      })
  },
  seatPay(e){
    // console.log(e)
    this.setData({
      orderId:e.currentTarget.dataset.order
    })
    let data_a = wx.getStorageSync('order-info')
    let orderId= e.currentTarget.dataset.order
    // console.log(orderId)
    // console.log(data_a,orderId)
    let data = null
    data_a.map((item,index)=>{
      if(item.orderId == orderId){
        data = item
      }
    })
    // console.log(data)
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
        wx.navigateTo({
          url: '../orderseatDetail/orderseatDetail?id='+orderId 
        })
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
        console.log(res)
          wx.navigateTo({
            url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
          })
      }
    })
    
  },
  getzf(num){  
    if(parseInt(num) < 10){  
        num = '0'+num;  
    }  
    return num;  
  }
  
})
