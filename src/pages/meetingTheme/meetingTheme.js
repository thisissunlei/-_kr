
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   inputValue:'',
   order_pay:{},
   type:'',
   submitError:true,
   errorMessage:''
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
  },
  onLoad: function (options) {
    let type = options.type;
    let that = this;
    let themeName = ''
    if(options.themeName=='undefined'){
      themeName = ''
    }else{
      themeName = options.themeName
    }
    if(type == 'submit'){
      this.setData({
        inputValue: themeName,
        type:options.type,
        orderId:options.orderId

      })
    }else if(type == 'storage'){
      wx.getStorage({
        key: 'order_pay',
        success: function(res) {
            that.setData({
              inputValue:themeName,
              type:type,
              order_pay:res.data,
              orderId:options.orderId

            })
        },
        fail:function(){
          that.setData({
              inputValue:themeName,
              type:type,
              order_pay:{},
            })
        }
      })
    }
  },

  formSubmit(e){
    let that = this;

    let type = this.data.type;
    let order_pay = this.data.order_pay;
    if(type=='storage'){
      order_pay.themeName = this.data.inputValue;
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
      this.submitTitle()
    }
    
  },
  submitTitle:function(){
    let that = this;
    //接口待定
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/updateExtInfo',
        method:"POST",
        data:{
          "orderId":that.data.orderId,
          "themeName":that.data.inputValue
        },
        success:(res)=>{
          if(res.data.code>0){
            wx.navigateBack({
              delta: 1
            })
          }else{
            that.setData({
              submitError:false,
              errorMessage:res.data.message
            })
            setTimeout(function(){
              that.setData({
                submitError:true,
                errorMessage:''
              })
            },2000)
          }
          
        },
        fail:(res)=>{
          that.setData({
              submitError:false,
              errorMessage:res.data.message
            })
            setTimeout(function(){
              that.setData({
                submitError:true,
                errorMessage:''
              })
            },2000)
          
        }
      })
  },



})
