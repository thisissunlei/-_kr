
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')
import * as createOrder from '../../utils/createOrder.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    inputValue:'',
    inputValues:'',
    phoneRange:'+86',
    phoneTest:true,
    phoneRepeat:true,
    phoneError:true,
    errorMessage:'',
    fun:'',
    auth: false
  },
  submit_buttom:true,
  getPhoneNumber: function(e) { 
    let from = this.data.from;
    let that = this;
    let fun = this.data.fun;
    let data = {
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv
    }
    
    if(e.detail.errMsg === 'getPhoneNumber:ok'){
      this.bindwxPhone(data)
    }
  } ,
  bindwxPhone(data){
    let fun = this.data.fun;
    let that = this;
    let authData = {};
    const value = wx.getStorageSync('bind_phone_auth')
    if (value) {
      authData = value || {};
      console.log('authData', authData);
    }
    if (this.data.auth) {
      Object.assign(data, authData)
      console.log('newData', data)
    }
    app.getRequest({
        url:app.globalData.KrUrl+ (this.data.auth ? 'api/gateway/krmting/wx/auth/bind-phone-grant' : 'api/gateway/krmting/wx/auth/bind-phone'),
        methods:"GET",
        data:data,
        success:(res)=>{
          let code = res.data.code;
          if(code>0){
            createOrder[fun](this,1)

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
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  onLoad: function (options) {
    this.setData({
      from:options.from,
      inputValue: options.value || '',
      inputValues: options.value || '',
      phoneRange:options.city || '86',
      fun : options.fun,
      auth: options.auth || false
    })
  },
  opencity(){
    wx.navigateTo({
      url: '../regionList/regionList?value=中国&fun='+this.data.fun+'&auth='+this.data.auth
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
  clearValue(e){
    this.setData({
      inputValue: '',
      inputValues: ''
    })
  },
  formSubmit(e){
    let that = this;
    let phoneTest = true;
    const l = this.data.inputValue.length;
    if (l <= 0 || l > 20) {
      phoneTest = false;
    }
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    

      this.submit_buttom = false
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/common/get-verify-code',
        methods:"GET",
        data:{
          "phone":that.data.inputValue,
          // areaCode: this.data.phoneRange
        },
        success:(res)=>{
          that.submit_buttom = true
          if(res.data.code>0 ){
               wx.hideLoading();
              wx.navigateTo({
                url: '../provingCode/provingCode?phone='+that.data.inputValue+'&region='+that.data.phoneRange+'&from='+this.data.from+'&fun='+this.data.fun+'&auth='+this.data.auth
              }); 

          }else{
             wx.hideLoading();
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
           wx.hideLoading();
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

  goNotice() {
    wx.navigateTo({
      url: '../guide/guide'
    });
  }


})
