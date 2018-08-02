
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
  orderId:'',
  alertTime:"",
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  onLoad: function (options) {
    let type = options.type;
    this.orderId = options.orderId;
    this.alertTime = options.alertTime;
    let that = this;
    let alertTime = ''
    if(options.alertTime=='undefined'){
      alertTime = ''
    }else{
      alertTime = options.alertTime
    }
    // console.log(alertTime,this.alertTime,99876)
    if(type == 'submit'){
      this.setData({
        activeTab: alertTime,
        type:options.type,
        orderId:options.orderId

      })
    }else if(type == 'storage'){
      // console.log(555555,alertTime)
      wx.getStorage({
        key: 'order_pay',
        success: function(res) {
            that.setData({
              activeTab: alertTime,
              type:type,
              order_pay:res.data,

            })
        },
        fail:function(){
          that.setData({
              activeTab: alertTime,
              type:type,
              order_pay:{},

          })
        }
      })
    }
  },

  checkWarn:function(e){

  


    wx.reportAnalytics('editenotice')
    let that = this;
    let type = this.data.type;
    var target = e.target.dataset;
    // console.log('checkWarn',target)
    let order_pay = this.data.order_pay;

    if(type=='storage' && this.button_boolean){
      this.button_boolean = false;
      order_pay.alertTime = target.code;
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
      
      this.submitWarn(target.code,order_pay)
    }    





    


  },
  submitWarn:function(targetcode,order_pay){
      








    let that = this;
    app.getRequest({
        // 修改订单
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/edit',
        method:"get",
        data:{
          orderId :that.orderId,
          alertTime:targetcode,
        },
        success:(res)=>{
           that.button_boolean = false;
           order_pay.alertTime = targetcode;
           that.setData({
             activeTab: targetcode,
           })
          // console.log(res,1111)
          setTimeout(function(){
             wx.navigateBack({
                delta: 1
              })
              that.button_boolean = true;
            },500)
          // 
        
        },
        fail:(error)=>{
            
        }
      })
    //接口待定
    // app.getRequest({
    //     url:app.globalData.KrUrl+'api/gateway/krmting/order/updateExtInfo',
    //     method:"POST",
    //     data:{
    //       "orderId":that.data.orderId,
    //       "alertTime":that.data.activeTab
    //     },
    //     success:(res)=>{
    //       if(res.data.code>0){
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       }else{
    //         that.setData({
    //           submitError:false,
    //           errorMessage:res.data.message
    //         })
    //         setTimeout(function(){
    //           that.setData({
    //             submitError:true,
    //             errorMessage:''
    //           })
    //         },2000)
    //       }
          
    //     },
    //     fail:(res)=>{
    //       that.setData({
    //           submitError:false,
    //           errorMessage:res.data.message
    //         })
    //         setTimeout(function(){
    //           that.setData({
    //             submitError:true,
    //             errorMessage:''
    //           })
    //         },2000)
          
    //     }
    //   })
  },
})
