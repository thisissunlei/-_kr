
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
})
