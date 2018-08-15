
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')

//index.js
//获取应用实例
const app = getApp()
let times;
Page({
  data: {
    phone:'',
    inputValue:'',
    phoneRange:'+86',
    phoneTest:true,
    phoneRepeat:true,
    phoneError:true,
    errorMessage:'',
    time:60,
    code:{
      value1:'',
      value2:'',
      value3:'',
      value4:''
    },
    user_info:{},
    success:false,
    areaCode:'',
    form:'order'
    
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  onLoad: function (options) {
    let that = this;
    if(options.from){
      this.setData({
        from:options.from
      })
    }
     wx.getStorage({
      key: 'user_info',
      success: function(res) {
        if(res.data){
          that.setData({
            user_info : res.data.user_info || {}
          })
        }
        }
      })
    this.setData({
      phone: options.phone,
      areaCode: options.region,
      time:60
    })
    this.countDown()
    

  },
  sendAgain(){
    this.sendPhone() 
  },
  countDown(){
    let that = this;
    let time = this.data.time;
    times = setInterval(function(){
      if(time==1){
        clearInterval(times);
      }
      that.setData({
        time:--time
      })
    },1000)
  },
  bindKeyInput:function(e){
    let value = e.detail.value;
    this.setData({
      inputValue: e.detail.value,
      code:{
        value1:value.substr(0,1),
        value2:value.substr(1,1),
        value3:value.substr(2,1),
        value4:value.substr(3,1),
      }
    })
  },
  clearValue(e){
    this.setData({
      inputValue: '',
    })
  },
  formSubmit(e){
    let that = this;
  
      app.getRequest({
        url:app.globalData.KrUrl+'/api/gateway/krmting/bind/phone',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        data:{
          "code":that.data.inputValue,
          "phone":that.data.phone,
          'areaCode':that.data.areaCode
        },
        success:(res)=>{


          if(res.data.code!=-1){
            that.user_info={
              phone : that.data.phone
            }
            wx.setStorage({
              key:"user_info",
              data:that.data.user_info,
              success:function(){
                that.setData({
                  success:true
                })
                setTimeout(function(){
                  that.setData({
                    success:false
                  })
                },2000)

                //处理判断散座还是订单
                if(that.data.from=='seat'){
                  that.getSeatData()
                } else if ( that.data.from == 'activity' ) {
                    wx.navigateBack({
                        delta: 2
                    })
                } else{
                  that.getOrderData();
                }
                
                
              }
            })
          }else{
            that.setData({
              phoneError:false,
              errorMessage:res.data.message,
            })
            setTimeout(function(){
              that.setData({
                phoneError:true,
                errorMessage:'',
                
              })
            },2000)
          }
        },
        fail:(res)=>{
            that.setData({
              phoneError:false,
              errorMessage:res.data.message,
            })
            setTimeout(function(){
              that.setData({
                phoneError:true,
                errorMessage:'',
                
              })
            },2000)
          
        }
      })
  },
  getOrderData(){
    let that = this;
    let create_order = {}
    wx.getStorage({
      key: 'create_order',
      success: function(res) {
        if(res.data){
          that.createOrder(res.data)
        }
      }
    })
    //orderData--->create_order取数据
  },
  getSeatData(){
    let that = this;
    let seat = {}
    

    wx.getStorage({
      key: 'myorder',
      success: function(res) {
        if(res.data){
          that.createSeat(res.data)
        }
      }
    })
    
    //orderData--->create_order取数据
  },
  createOrder:function(create_order){
    let that = this;
    let data=this.data;
    
    let orderData = create_order;
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/order/create',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:orderData.create_order,
          
          success:(res)=>{
            let code=res.data.code;
            let rsData = res.data.data;
            if(code==-1){
              that.setData({
                phoneError:false,
                success:false,
                errorMessage:res.data.message
              })
              setTimeout(function(){
                that.setData({
                  phoneError:true,
                  errorMessage:'',

                  
                })
              },2000)
            }else if(code === 2){
            // 使用优惠券后，价格为0
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
                wx.hideLoading();
              }, 500)
              
            }else{
              that.weChatPay(rsData)
              that.clearStorage()
            }

          },
          
        })
       
  },

  weChatPay:function(data){
    let id = data.orderId;
    let that = this;
    if(that.data.from=='seat'){
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/order/pay',
        methods:"GET",
        data:{
          orderId:id
        },
        success:(res)=>{
          console.log('res',res)
          if(res.data.code>0){
            console.log(res.data,11111111)
            if (!wx.getStorageSync("order-info")) {
                let orderArr = []
                console.log(typeof res.data.data,res.data.data,orderArr,res.data,333333)
                orderArr.push(res.data.data)
                wx.setStorageSync("order-info", orderArr)
                wx.setStorageSync("order", res.data.data)
              } else {
                let orderseat = wx.getStorageSync("order-info")
                console.log(typeof res.data.data,res.data.data,orderseat,res.data,44444)
                orderseat.push(res.data.data)
                wx.setStorageSync("order-info", orderseat)
                wx.setStorageSync("order", res.data.data)
              }
            wx.requestPayment({
              'timeStamp': res.data.data.timestamp,
              'nonceStr': res.data.data.noncestr,
              'package': res.data.data.packages,
              'signType':res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success':function(res){
                wx.showLoading({
                  title: '加载中',
                  mask:true
                })

                setTimeout(function(){
                  that.getInviteeId(id)
                },2000)
                
              },
              'fail':function(res){
                if(that.data.from!='seat'){
                  wx.navigateTo({
                    url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
                  })
                }else{

                  wx.navigateTo({
                    url: '../orderseatDetail/orderseatDetail?id='+data.orderId+'&con=1'
                  })
                }
                
              }
            })
          }else{
            if(that.data.from!='seat'){
                  wx.navigateTo({
                    url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
                  })
                }else{
                  wx.navigateTo({
                    url: '../orderseatDetail/orderseatDetail?id='+data.orderId+'&con=1'
                  })
                }
          }
          
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
    }else{
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
                wx.showLoading({
                  title: '加载中',
                  mask:true
                })

                setTimeout(function(){
                  that.getInviteeId(id)
                },2000)
                
              },
              'fail':function(res){
                if(that.data.from!='seat'){
                  wx.navigateTo({
                    url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
                  })
                }else{
                  wx.navigateTo({
                    url: '../orderseatDetail/orderseatDetail?id='+data.orderId+'&con=1'
                  })
                }
                
              }
            })
          }else{
            if(that.data.from!='seat'){
                  wx.navigateTo({
                    url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
                  })
                }else{
                  wx.navigateTo({
                    url: '../orderseatDetail/orderseatDetail?id='+data.orderId+'&con=1'
                  })
                }
          }
          
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })


    }
    
    
   
  },
  clearStorage(){
    let _this = this;
    wx.setStorage({
      key:"order_pay",
      data:{}
    })
  },
  sendPhone(e){
    let that = this;
    console.log(that.data)
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/common/get-verify-code',
        methods:"GET",
        data:{
          "phone":that.data.phone 
        },
        success:(res)=>{
          if(res.data.code>0){
            that.setData({
              time:60
            },function(){
              that.countDown()
            })
            
          }
          console.log('success',res)
          if(res.data.code<0){
            that.setData({
              phoneError:false,
              errorMessage:res.data.message,
            })
            setTimeout(function(){
              that.setData({
                phoneError:true,
                errorMessage:'',
                
              })
            },2000)
          }
          
        },
        fail:(res)=>{

          that.setData({
            phoneError:false,
            errorMessage:res.message,
          })
          setTimeout(function(){
            that.setData({
              phoneError:true,
              errorMessage:'',
              
            })
          },2000)
          
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
  createSeat(data){
    let that = this;
    app.getRequest({
    // 散座下单
    url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/create',
    methods: "GET",
    header: {
      'content-type': "appication/json"
    },
    data: data,

    success:(res)=>{
            let code=res.data.code;
            let rsData = res.data.data;
            if(code==-1){
              that.setData({
                phoneError:false,
                success:false,
                errorMessage:res.data.message
              })
              setTimeout(function(){
                that.setData({
                  phoneError:true,
                  errorMessage:'',

                  
                })
              },2000)
            }else{
              that.weChatPay(rsData)
              that.clearStorage()
            }

    },
    fail:(res)=>{
      wx.navigateBack({
        delta: 2
      })
    }

  })
  }
})
