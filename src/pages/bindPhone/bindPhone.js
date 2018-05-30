
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

      wx.request({
        url:app.globalData.KrUrl+'/api/gateway/krmting/common/get-verify-code',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        data:{
          "phone":that.data.inputValue
        },
        success:(res)=>{
          wx.navigateTo({
            url: '../provingCode/provingCode?phone='+that.data.inputValue
          });
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
})
