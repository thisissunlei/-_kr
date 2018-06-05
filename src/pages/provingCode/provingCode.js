
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
    areaCode:''
    
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  onLoad: function (options) {
    let that = this;
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
                that.getOrderData();
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
                that.getInviteeId(id)
              },
              'fail':function(res){
                wx.navigateTo({
                  url: '../orderDetail/orderDetail?id='+data.orderId
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '../orderDetail/orderDetail?id='+data.orderId
            })
          }
          
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
   
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
})
