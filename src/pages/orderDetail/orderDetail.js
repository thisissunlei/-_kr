//index.js
//获取应用实例
import CAlculagraph from "../../utils/time.js" ;

const app = getApp()

Page({
  data: {
    minute:'',
    second:'',
    detailInfo:{
      orderShowStatus:'2',
      first:1
    },
    payTitle:''
    
  },
  jumpMeetDetail:function() {
   
  },
  jumpSetTheme:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../meetingTheme/meetingTheme?value='+detailInfo.themeName
    })
  },
  jumpSetRemind:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../warn/warn?value='+detailInfo.alertTime
    })
  },
  jumpSetPhone:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../phone/phone?value='+detailInfo.linkPhone
    })
  },
  onLoad: function () {
    console.log(CAlculagraph)
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    // time.timerMint({
    //   deadline:new Date().getTime()/1000+300,//最终结束的时间戳,
    //   callback:function (){
    //     console.log(111)
    //   },//时间结束
    //   that:this
    // });
    this.getDetailInfo('2')
   
  },
  getDetailInfo:function(orderId){

    let data={
      orderShowStatus:3
    }
    let titleObj={
      '1':'待支付订单',
      '2':'待使用订单',
      '3':'已使用订单',
      '4':'已取消订单'
    }
    let payTitleObj={
      '1':'应付款',
      '2':'实付款',
      '3':'实付款',
      '4':'应付款'
    }
   
    this.setData({
      payTitle:payTitleObj[data.orderShowStatus]
    })
    wx.setNavigationBarTitle({
      title: titleObj[data.orderShowStatus]
    })

    //上面是假数据

    wx.request({
      url:'/api/gateway/krmting/order/detail',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        orderId:orderId
      },
      success:(res)=>{
          let data=res.data;
            console.log(res)
           
            let titleObj={
              '1':'待支付订单',
              '2':'待使用订单',
              '3':'已使用订单',
              '4':'已取消订单'
            }
            let payTitleObj={
              '1':'应付款',
              '2':'实付款',
              '3':'实付款',
              '4':'应付款'
            }
            this.setData({
              payTitle:payTitleObj[data.orderShowStatus]
            })

            wx.setNavigationBarTitle({
              title: titleObj[data.orderShowStatus]
            })
      }
  })
  
  
  },

   
})
