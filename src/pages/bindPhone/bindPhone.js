
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
  },
  onLoad: function (options) {
    this.setData({
      inputValue: options.value || '',
      inputValues: options.value || '',
      phoneRange:options.city || '+86'
    })
  },
  opencity(){
    wx.navigateTo({
      url: '../regionList/regionList?value=+86'
    });
  },
  bindKeyInput:function(e){
    let value = e.detail.value;
    if(value.length ==3){
      value += " ";
    }
    if(value.length == 8){
      value += ' '
    }
    this.setData({
      inputValue: value,
    })
  },
  phoneTest(){
    // var phoneTest = util.phone(this.data.inputValue)
    // this.setData({
    //   phoneTest:phoneTest
    // })
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
    let phone =this.data.inputValue.replace(/[^\d]/g,'');
    var phoneTest = util.phone(phone)
    this.setData({
      phoneTest:phoneTest
    })
    if(!phoneTest){
      setTimeout(function(){
        that.setData({
          phoneTest:true
        })
      },2000)
    }
    if(phoneTest){
      wx.navigateTo({
        url: '../provingCode/provingCode?phone='+this.data.inputValue
      });
    }
    // if(this.data.phoneTest){
    //   wx.request({
    //     url:'api/gateway/krmting/home',
    //     methods:"GET",
    //     header:{
    //       'content-type':"appication/json"
    //     },
    //     data:{
    //       "atitude":"39.92",
    //       "longitude":"116.46"
    //     },
    //     success:(res)=>{
    //       cosole.log(res)
    //     },
    //     fail:(res)=>{
    //        console.log('========',res)
    //     }
    //   })
    // }
  },
})
