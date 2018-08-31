
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue:'',
    inputValues:'',
    phoneRange:'+86',
    phoneTest:true,
    phoneRepeat:true,
    phoneError:true,
    errorMessage:''
  },
  submit_buttom:true,
  getPhoneNumber: function(e) { 
    let from = this.data.from;
    let that = this;
    let data = {
      encryptedData:e.detail.encryptedData
    }
    if(e.detail.errMsg === 'getPhoneNumber:ok'){
      // 给后台发送
      console.log('提交生成订单及其余下内容')
      that.bindWechatPhone(data)
      
    }
  } ,
  bindWechatPhone(data){
    let that = this.
     app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/wx/auth/bind-phone',
        methods:"GET",
        data:data,
        success:(res)=>{
          //处理判断散座还是订单
          switch (from){
            case 'seat':
              that.getSeatData()
              break;
            case 'activity':
              wx.navigateBack({
                  delta: 1
              })
              break;
            default:
              that.getOrderData();
              break;
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
              
            },function(){
              wx.navigateBack({
                  delta: 1
              })
            })
          },2000)
          
        }
      })
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  onLoad: function (options) {
    this.setData({
      from:options.from,
      inputValue: options.value || '',
      inputValues: options.value || '',
      phoneRange:options.city || '86'
    })
  },
  opencity(){
    wx.navigateTo({
      url: '../regionList/regionList?value=中国'
    });
  },
  bindKeyInput:function(e){
    // let value = e.detail.value.replace(/[^\d]/g,'');
    // let val = this.dealPhone(value)
    this.setData({
      inputValues: e.detail.value,
      inputValue: e.detail.value
    })
  },
  dealPhone(value){
    let len = value.length;
    let val = ''
    if(len>3 && len<=7){
      val = value.substr(0,3)+' '+ value.substr(3,len-3);
    }else if(len>7){
      val = value.substr(0,3)+' '+ value.substr(3,4)+' '+ value.substr(7,len-7);
    }else{
      val = value
    }
    return val;
  },
  bindViewTap(){
    console.log('bindViewTap')

  },
  clearValue(e){
    this.setData({
      inputValue: '',
      inputValues: ''
    })
  },
  formSubmit(e){
    let that = this;
    var phoneTest = util.phone(this.data.inputValue)
    this.setData({
      phoneTest:phoneTest
    })
    if(!phoneTest){
      setTimeout(function(){
        that.setData({
          phoneTest:true
        })
      },2000)
      return;
    }
    if(!this.submit_buttom ){
      return;
    }
    

      this.submit_buttom = false
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/common/get-verify-code',
        methods:"GET",
        data:{
          "phone":that.data.inputValue
        },
        success:(res)=>{
          that.submit_buttom = true
          if(res.data.code>0 ){
              
              wx.navigateTo({
                url: '../provingCode/provingCode?phone='+that.data.inputValue+'&region='+that.data.phoneRange+'&from='+this.data.from
              }); 

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
            wx.navigateTo({
              url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
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
          that.weChatPaySeat(rsData)
        }
      },
      fail:(res)=>{
        wx.navigateBack({
          delta: 1
        })
      }

    })
  },
  createOrder:function(create_order){
    let that = this;
    let data = this.data;
    let orderData = create_order;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/create',
      methods: "GET",
      header: {
        'content-type': "appication/json"
      },
      data: orderData.create_order,
      success: (res) => {
        let code = res.data.code;
        let rsData = res.data.data;
        if (code == -1) {
          that.setData({
            phoneError: false,
            success: false,
            errorMessage: res.data.message
          })
          setTimeout(function() {
            that.setData({
              phoneError: true,
              errorMessage: '',
            })
          }, 2000)
        } else if (code === 2) {
          // 使用优惠券后，价格为0
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '../orderDetail/orderDetail?id=' + res.data.data.orderId + '&con=' + 1
            })
            wx.hideLoading();
          }, 500)
        } else {
          that.weChatPayMeeting(rsData)
        }
      },
    })
  },
  weChatPayMeeting:function(data){
    let id = data.orderId;
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/pay',
      methods: "GET",
      data: {
        orderId: id
      },
      success: (res) => {
        console.log('res', res)
        if (res.data.code > 0) {
          wx.requestPayment({
            'timeStamp': res.data.data.timestamp,
            'nonceStr': res.data.data.noncestr,
            'package': res.data.data.packages,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function(res) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function() {
                that.getInviteeId(id)
              }, 2000)
            },
            'fail': function(res) {
              wx.navigateTo({
                url: '../orderDetail/orderDetail?id=' + data.orderId + '&con=1'
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../orderseatDetail/orderseatDetail?id=' + data.orderId + '&con=1'
          })
        }

      },
      fail: (res) => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  weChatPaySeat:function(data){
    let id = data.orderId;
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/order/pay',
      methods: "GET",
      data: {
        orderId: id
      },
      success: (res) => {
        console.log('res', res)
        if (res.data.code > 0) {
          console.log(res.data, 11111111)
          if (!wx.getStorageSync("order-info")) {
            let orderArr = []
            console.log(typeof res.data.data, res.data.data, orderArr, res.data, 333333)
            orderArr.push(res.data.data)
            wx.setStorageSync("order-info", orderArr)
            wx.setStorageSync("order", res.data.data)
          } else {
            let orderseat = wx.getStorageSync("order-info")
            console.log(typeof res.data.data, res.data.data, orderseat, res.data, 44444)
            orderseat.push(res.data.data)
            wx.setStorageSync("order-info", orderseat)
            wx.setStorageSync("order", res.data.data)
          }
          wx.requestPayment({
            'timeStamp': res.data.data.timestamp,
            'nonceStr': res.data.data.noncestr,
            'package': res.data.data.packages,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function(res) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })

              setTimeout(function() {
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + id + '&con=' + 1
                })
              }, 2000)

            },
            'fail': function(res) {
              wx.navigateTo({
                url: '../orderseatDetail/orderseatDetail?id=' + data.orderId + '&con=1'
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../orderseatDetail/orderseatDetail?id=' + data.orderId + '&con=1'
          })
        }

      },
      fail: (res) => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
   
  },


})
