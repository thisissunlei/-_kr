
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue:'技术部集体会议',
    type:'',
    order_pay:{},
    submitError:true,
    phoneError:true,
    errorMessage:'',
    phoneTest:true
  },
  bindViewTap(){
    console.log('bindViewTap')
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
    console.log('clearValue', this)
  },
  formSubmit(e){
    let that = this;
    console.log('form发生了submit事件，携带数据为：', this.data.inputValue)
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
        url:app.globalData.KrUrl+'/api/gateway/krmting/order/updateExtInfo',
        methods:"GET",
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
    let that = this;
    console.log('phone-onLoad',type)
    if(type == 'submit'){
      this.setData({
        inputValue: options.value || '',
        type:options.type,
        orderId:options.orderId

      })
    }else if(type == 'storage'){
      wx.getStorage({
        key: 'order_pay',
        success: function(res) {
          console.log('--------',res.data)
          if(res.data){
            console.log('order_pay')
            that.setData({
              inputValue: res.data.linkPhone|| '',
              type:type,
              order_pay:res.data,
              orderId:options.orderId
            })
          }
        }
      })
    }
  },


})
