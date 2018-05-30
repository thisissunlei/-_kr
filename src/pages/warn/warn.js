
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeTab:'NOALERT',
    item:'item',
    active:'active item',
    order_pay:{},
    submitError:true
  },
  button_boolean:true,

  onLoad: function (options) {
    let type = options.type;
    let that = this;
    if(type == 'submit'){
      this.setData({
        activeTab: options.value || 'NOALERT',
        type:options.type
      })
    }else if(type == 'storage'){
      wx.getStorage({
        key: 'order_pay',
        success: function(res) {
          if(res.data){
            that.setData({
              activeTab: res.data.warn || 'NOALERT',
              type:type,
              order_pay:res.data
            })
          }
        }
      })
    }
  },
  checkWarn:function(e){
    let that = this;
    let type = this.data.type;
    var target = e.target.dataset;
    console.log('checkWarn',target)
    let order_pay = this.data.order_pay;
    if(type=='storage' && this.button_boolean){
      this.button_boolean = false;
      order_pay.warn = target.code;
      that.setData({
        activeTab: target.code,
      })
      wx.setStorage({
        key:"order_pay",
        data:order_pay,
        success:function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
            that.button_boolean = true;
          },500)
          
        }
      })
    }else{
      that.setData({
        activeTab: target.code,
      })
      this.submitWarn()
    }    
  },
  submitWarn:function(){
    let that = this;
    //接口待定
    app.getRequest({
        url:app.globalData.KrUrl+'/api/gateway/krmting/bind/phone',
        methods:"GET",
        data:{
          "code":that.data.activeTab,
          "phone":that.data.phone
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
