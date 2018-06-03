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
    payTitle:'',
    orderId:'',
    meetDetailShow:false,
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum:1,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    meetInfo:['1','2','3',4,5,7,9,9,4,5,7,9,9],
    meetingRoomId:'',
  },


  payOrder:function(){
    let orderId=this.data.orderId;
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
      method:"POST",
      data:{
        orderId:orderId
      },
      success:(res)=>{
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.data.timestamp,
          'nonceStr': res.data.data.noncestr,
          'package': res.data.data.packages,
          'signType':res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success':function(res){
            console.log(res)
            wx.navigateTo({
              url: '../paySuccess/paySuccess?inviteeId='+detailInfo.inviteeId
            })
          },
          'fail':function(res){
          }
        })
      },
      fail:(error)=>{
          
      }
    })

  },
  currentChange:function(e){
    if(e.detail.source=="touch"){
      this.setData({
        currentNum:e.detail.current+1
      })
    }
  },
  openMeetDetail:function(e){
    let detailInfo=this.data.detailInfo;
    let that = this;
    this.setData({
      meetingRoomId:detailInfo.meetingRoomId,
      meetDetailShow:!this.data.meetDetailShow
    },function(){
      that.getMeetDetail()
    })
  },
  closeMeetDetail:function(){
      this.setData({
        meetingRoomId:'',
        meetDetailShow:!this.data.meetDetailShow
      })
  },
  jumpMeet:function() {
    let detailInfo=this.data.detailInfo;
    console.log(detailInfo,'detail')
    wx.navigateTo({
      url: '../meetingDetail/meetingDetail?inviteeId='+detailInfo.inviteeId
    })
  },
  jumpSetTheme:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../meetingTheme/meetingTheme?themeName='+detailInfo.themeName+'&type=submit'+'&orderId='+this.data.orderId
    })
  },
  jumpSetRemind:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../warn/warn?alertTime='+detailInfo.alertTime+'&type=submit'+'&orderId='+this.data.orderId
    })
  },
  jumpSetPhone:function() {
    let detailInfo=this.data.detailInfo;
    if(detailInfo.orderShowStatus==3){
      return;
    }
    wx.navigateTo({
      url: '../phone/phone?linkPhone='+detailInfo.linkPhone+'&type=submit'+'&orderId='+this.data.orderId
    })
  },
  onLoad: function (opstion) {

    console.log('opstion----',opstion)
    this.getDetailInfo(opstion.id)
    this.setData({
      orderId:opstion.id
    })
   
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
                'OBLIGATION':'待支付订单',
                'TOBEUSED':'待使用订单',
                'USED':'已使用订单',
                'CLOSED':'已取消订单'
              }
              let payTitleObj={
                'OBLIGATION':'应付款',
                'TOBEUSED':'实付款',
                'USED':'实付款',
                'CLOSED':'应付款'
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
              let hour=(data.endTime-data.beginTime)/3600000;
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
              _this.startcountDate(detailInfo.expiredTime);
        },
        fail:(error)=>{
          
        }
      })
  },
  startcountDate:function(date){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:date,//最终结束的时间戳,
      callback:function (){
        console.log(111)
      },//时间结束
      that:this
    });
  },


  getMeetDetail(){
    let meetingRoomId = this.data.meetingRoomId;
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/detail',
        method:"GET",
        data:{
          "meetingRoomId":meetingRoomId
        },
        success:(res)=>{
          if(res.data.code>0){
            let meetingDetail = res.data.data;
            console.log(meetingDetail.device)
            that.setData({
              meetingDetail:meetingDetail
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

 
