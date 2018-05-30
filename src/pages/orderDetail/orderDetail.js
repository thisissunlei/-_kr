//index.js
//获取应用实例
import CAlculagraph from "../../utils/time.js" ;

const app = getApp()

Page({
  data: {
    minute:'',
    second:'',
    detailInfo:{
      orderShowStatus:1,
      first:1,
      useDate:''
    },
    payTitle:''
    
  },
  payOrder:function(){

  },
  jumpMeetDetail:function() {
   
  },
  jumpMeet:function() {
    let detailInfo=this.data.detailInfo;
    wx.navigateTo({
      url: '../paySuccess/paySuccess?inviteeId='+detailInfo.inviteeId
    })
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
   
    this.getDetailInfo('1')
   
  },
  getDetailInfo:function(orderId){
    const _this=this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/detail',
        method:"GET",
        data:{
          orderId:orderId
        },
        success:(res)=>{
            let data=res.data.data;
            
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
              
              let themeObj={
                'NOALERT':'无',
                'FIVE':'提前5分钟',
                'FIFTEEN':'提前15分钟',
                'THIRTY':'提前30分钟'
              }
              let detailInfo=Object.assign({},data);
              detailInfo.themeTime=themeObj[data.alertTime];
              let dateArr=changeTime(data.useDate);
              let useDate=dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2];
              let startArr=changeTime(data.beginTime)
              let endArr=changeTime(data.endTime)
              let beginTime=startArr[3]+':'+startArr[4]
              let endTime=endArr[3]+':'+endArr[4];
                  detailInfo.useDate=useDate;
                  detailInfo.beginTime=beginTime;
                  detailInfo.endTime=endTime;
              let hour=(data.endTime-data.beginTime)/1000/60/60;
              let Ctime=changeTime(data.ctime);
              detailInfo.ctime=Ctime[0]+"-"+Ctime[1]+"-"+Ctime[2]+" "+Ctime[3]+":"+Ctime[4]+":"+Ctime[5]
              this.setData({
                payTitle:payTitleObj[data.orderShowStatus],
                detailInfo:detailInfo,
                hour:hour
              })

              wx.setNavigationBarTitle({
                title: titleObj[data.orderShowStatus]
              })
              _this.startcountDate(detailInfo.ctime);
        },
        fail:(error)=>{
          
        }
      })
  },
  startcountDate:function(date){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:date/1000+300,//最终结束的时间戳,
      callback:function (){
        console.log(111)
      },//时间结束
      that:this
    });
  }
   
})
function changeTime(date){
  let  myDate =new Date(date) || new Date();
   var myArray =new Array();
  let year=myDate.getFullYear();
  let month =myDate.getMonth()+1;
  let day=myDate.getDate();
  let hour=myDate.getHours();
  let minutes=myDate.getMinutes();
  let seconds=myDate.getSeconds();
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
    myArray[5] = seconds;
    return myArray;
}

 
