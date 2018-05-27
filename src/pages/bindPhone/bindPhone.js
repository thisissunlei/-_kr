
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
    let value = e.detail.value.replace(/[^\d]/g,'');
    let val = this.dealPhone(value)
    this.setData({
      inputValues: val,
      inputValue: value.replace(/[^\d]/g,'')
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
