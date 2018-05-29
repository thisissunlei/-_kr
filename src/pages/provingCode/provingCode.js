
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')

//index.js
//获取应用实例
const app = getApp()
let times;
Page({
  data: {
    phone:'',
    inputValues:'',
    phoneRange:'+86',
    phoneTest:true,
    phoneRepeat:true,
    time:60,
  },
  onLoad: function (options) {
    let that = this;
    
    this.setData({
      phone: options.phone,
      time:60
    })
    this.countDown()
    

  },
  sendAgain(){
    this.setData({
      time:60
    })
    this.countDown()
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
    this.setData({
      inputValue: e.detail.value,
      inputValues: e.detail.value
    })
  },
  clearValue(e){
    this.setData({
      inputValue: '',
      inputValues: ''
    })
  },
  formSubmit(e){
    let that = this;
      wx.request({
        url:app.globalData.KrUrl+'/api/gateway/krmting/bind/phone',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        data:{
          "code":that.data.inputValues,
          "phone":that.data.phone
        },
        success:(res)=>{
          cosole.log(res)
        },
        fail:(res)=>{
          that.setData({
            phoneTest:false
          })
          setTimeout(function(){
            that.setData({
              phoneTest:true
            })
          },2000)
          
        }
      })
  },
})
