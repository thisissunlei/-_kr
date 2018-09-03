
import * as CAlculagraph from '../../utils/time.js';
const util = require('../../utils/util.js')
import * as createOrder from '../../utils/createOrder.js';

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
    errorMessage:'',
    fun:''
  },
  submit_buttom:true,
  getPhoneNumber: function(e) { 
    let from = this.data.from;
    let that = this;
    let fun = this.data.fun;
    let data = {
      encryptedData:e.detail.encryptedData
    }
    
    if(e.detail.errMsg === 'getPhoneNumber:ok'){
      createOrder[fun](this,1)
    }
  } ,
  create(){
    let fun = this.data.fun;
    console.log('提交生成订单及其余下内容',createOrder)
    console.log(fun,'====fun')
    createOrder[fun](this,1)
  },
  bindWechatPhone(data){
    let that = this.
     app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/wx/auth/bind-phone',
        methods:"GET",
        data:data,
        success:(res)=>{
          //处理判断散座还是订单
          switch (from){
            case 'seat':
              that.getSeatData()
              break;
            case 'activity':
              wx.navigateBack({
                  delta: 1
              })
              break;
            default:
              that.getOrderData();
              break;
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
              
            },function(){
              wx.navigateBack({
                  delta: 1
              })
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
      fun : options.fun
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
                url: '../provingCode/provingCode?phone='+that.data.inputValue+'&region='+that.data.phoneRange+'&from='+this.data.from+'&fun='+this.data.fun
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
