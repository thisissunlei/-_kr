
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue:'',
    type:'',
    order_pay:{},
    submitError:true,
    phoneError:true,
    errorMessage:'',
    phoneTest:true
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  bindKeyInput:function(e){
    let value = e.detail.value;
    this.setData({
      inputValue: e.detail.value,
      inputValues: e.detail.value
    })
  },
  clearValue(e){
    this.setData({
      inputValue: ''
    })
  },
  formSubmit(e){
    wx.reportAnalytics('editephone')
    let that = this;
    // 校验手机格式--start
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
    //校验 --- end

    let type = this.data.type;
    let order_pay = this.data.order_pay;
    console.log('formSubmit===',type)
    if(type=='storage'){
      order_pay.linkPhone = this.data.inputValue;
      wx.setStorage({
        key:"order_pay",
        data:order_pay,
        success:function(){
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }else{
      this.submitPhone()
    }
    
  },
  submitPhone:function(){
    let that = this;
    //接口待定
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/updateExtInfo',
        method:"POST",
        data:{
          'orderId':that.data.orderId,
          "linkPhone":that.data.inputValue,
        },
        success:(res)=>{
          

          if(res.data.code>0){
            wx.navigateBack({
              delta: 1
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
  onLoad: function (options) {
    let type = options.type;
    let phone = ''
    if(options.linkPhone=='undefined'){
      phone = ''
    }else{
      phone = options.linkPhone
    }
    let that = this;
    if(type == 'submit'){
      this.setData({
        inputValue: phone || '',
        type:options.type,
        orderId:options.orderId

      })
    }else if(type == 'storage'){
      wx.getStorage({
        key: 'order_pay',
        success: function(res) {
            that.setData({
              inputValue:phone,
              type:type,
              order_pay:res.data,
            })
        },
        fail:function(){
          that.setData({
            inputValue: phone,
            type:type,
            order_pay:{},
          })
        }
      })
    }
  },


})
