
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
    success:false
    
  },
  onLoad: function (options) {
    let that = this;
     wx.getStorage({
      key: 'user_info',
      success: function(res) {
        if(res.data){
          that.user_info = res.data.user_info || {};
        }
        }
      })
    this.setData({
      phone: options.phone || '110',
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
          "phone":that.data.phone
        },
        success:(res)=>{


          if(res.data.code>0){
            that.user_info={
              phone : that.data.phone
            }
            wx.setStorage({
              key:"user_info",
              data:that.user_info,
              success:function(){
                that.setData({
                  success:true
                })
                wx.navigateTo({
                  url: '../index/index'
                });
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
})
