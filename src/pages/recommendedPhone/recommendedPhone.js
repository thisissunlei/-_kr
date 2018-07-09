
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

    if(type=='storage'){
      order_pay.recommendedPhone = this.data.inputValue;
      wx.setStorage({
        key:"order_pay",
        data:order_pay,
        success:function(){
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
    
  },
  onLoad: function (options) {
    let type = options.type;
    let phone = ''
    if(options.recommendedPhone=='undefined'){
      phone = ''
    }else{
      phone = options.recommendedPhone
    }
    let that = this;
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
    
  },


})
