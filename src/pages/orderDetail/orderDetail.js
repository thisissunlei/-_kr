//index.js
//获取应用实例
import CAlculagraph from "../../utils/time.js" ;

const app = getApp()

Page({
  data: {
    minute:'',
    second:'',
    detailInfo:{
      orderShowStatus:'1',
      first:1,
      useDate:''
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
    let data={
      orderShowStatus:1
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
    let dateArr=changeTime(1396310706000)
    let useDate=dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2];
    let startArr=changeTime(1396310706000)
    let endArr=changeTime(1396320706000)
    let beginTime=startArr[3]+':'+startArr[4]
    let endTime=endArr[3]+':'+endArr[4];
    let hour=(1396320706000-1396310706000)
    this.setData({
      payTitle:payTitleObj[data.orderShowStatus],
      detailInfo:{
        useDate:useDate,
        beginTime:beginTime,
        endTime:endTime,
        hour:hour
      }
    })
    wx.setNavigationBarTitle({
      title: titleObj[data.orderShowStatus]
    })





    this.startcountDate();
   
    this.getDetailInfo('2')
   
  },
  getDetailInfo:function(orderId){
      wx.request({
        url:app.globalData.KrUrl+'/api/gateway/krmting/order/detail',
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
              let detailInfo=Object.assign({},data);
              let dateArr=changeTime(data.useDate);
              let useDate=dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2];
              let startArr=changeTime(data.beginTime)
              let endArr=changeTime(data.endTime)
              let beginTime=startArr[3]+':'+startArr[4]
              let endTime=endArr[3]+':'+endArr[4];
                  detailInfo.useDate=useDate;
                  detailInfo.beginTime=beginTime;
                  detailInfo.endTime=endTime;
              this.setData({
                payTitle:payTitleObj[data.orderShowStatus],
                detailInfo:detailInfo
              })

              wx.setNavigationBarTitle({
                title: titleObj[data.orderShowStatus]
              })
        }
      })
  },
  startcountDate:function(){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:new Date().getTime()/1000+300,//最终结束的时间戳,
      callback:function (){
        console.log(111)
      },//时间结束
      that:this
    });
  }
   
})
function changeTime(date){
  let  myDate =new Date(date) || new Date();
  console.log('myDate',myDate)
   var myArray =new Array();
   
  let year=myDate.getFullYear();
  let month =myDate.getMonth()+1;
  let day=myDate.getDate();
  let hour=myDate.getHours();
  let minutes=myDate.getMinutes();
      if(month<10){
        month=`0${month}`
      }
      if(day<10){
        day=`0${day}`
      }
      if(hour==0){
         hour='00'
      }else if(hour>0 && hour<10){
         hour=`0${hour}`
      }
    
      if(minutes==0){
         minutes='00'
      }else if(minutes>0 && minutes<10){
         minutes=`0${minutes}`
      }
    myArray[0] = year;
    myArray[1] = month;
    myArray[2] = day;
    myArray[3] = hour;
    myArray[4] = minutes;
    return myArray;
}

// function startcountDate(time,callback){
  
// }
