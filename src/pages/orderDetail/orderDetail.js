//index.js
//获取应用实例
import {CAlculagraph} from "../../utils/time.js" ;

const app = getApp()

Page({
  data: {
    con:'',
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
    titleObj:{},
    ifFixed:false,
    imgUrl:app.globalData.KrImgUrl,
   
  },
  time_cal:"",
  scrollTopEvent(e){
    let top=e.detail.scrollTop;
    console.log('top------',top)
    if(top>=145){
      this.setData({
        ifFixed:true
      })
    }else{
      this.setData({
        ifFixed:false
       })
    }
    
  },
  
  //邀请参会人
  onShareAppMessage: function (res) {
    console.log(res,8888)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
        wx.reportAnalytics('sharemeeting')
    
    return {
      title: '戳我一键参会！邀请您于"'+this.data.detailInfo.ctime+'"在"'+this.data.detailInfo.meetingRoomName+'"参加"'+this.data.detailInfo.themeName+'"',
      path: 'pages/meetingStatus/meetingStatus?inviteeId='+this.data.detailInfo.inviteeId,
      imageUrl:'../images/indexImg/statusbg.png'
    }
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
        var _this=this;
        console.log(res)
        wx.reportAnalytics('confirmorder')
        wx.requestPayment({
          'timeStamp': res.data.data.timestamp,
          'nonceStr': res.data.data.noncestr,
          'package': res.data.data.packages,
          'signType':res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success':function(res){
            wx.showLoading({
              title: '加载中',
              mask:true
            })
            setTimeout(
              function(){
                _this.getInviteeId(orderId,_this.jumpPaySuccess)
                wx.hideLoading()
              },1500)
          },
          'fail':function(res){
          }
        })
      },
      fail:(error)=>{
          
      }
    })

  },
  jumpPaySuccess:function(inviteeId){
    wx.navigateTo({
      url: '../paySuccess/paySuccess?inviteeId='+inviteeId
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
    // wx.reportAnalytics('goodsdetails')

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
  jumpMeetingStatus:function(inviteeId){
      wx.navigateTo({
        url: '../meetingStatus/meetingStatus?inviteeId='+inviteeId
      })
  },
  jumpMeet:function() {
    let detailInfo=this.data.detailInfo;
   
    if(detailInfo.join){
      this.getInviteeId(detailInfo.orderId,this.jumpMeetingDetail)
    }else{
      this.getInviteeId(detailInfo.orderId,this.jumpMeetingStatus)
    }
   
    
  },
  
  getInviteeId(orderId,callback){
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
      methods:"GET",
      header:{
        "content-type":"application/json"
      },
      data:{
        orderId:orderId
      },
      success:(res)=>{
        if(res.data.data.inviteeId){
            callback && callback(res.data.data.inviteeId);
        }
        
      }
    })
  },
  jumpMeetingDetail:function(inviteeId){
    wx.navigateTo({
      url: '../meetingDetail/meetingDetail?inviteeId='+inviteeId
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
    
    if(opstion.con){
      this.setData({
        orderId:opstion.id,
        con:opstion.con
      })
    }else{
      this.setData({
        orderId:opstion.id
      })
    }
    
   
  },
  onUnload:function(){
    if(this.data.con==1){
      console.log(2222,this.time_cal)
      if(this.detailInfo.orderShowStatus=='OBLIGATION'){
        this.time_cal.closeCal();
      }
     
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },
  onShow:function(){
    this.getDetailInfo(this.data.orderId)
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
              this.setData({
                titleObj:titleObj
              })
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
              if(data.orderShowStatus=='OBLIGATION'){
                  _this.startcountDate(detailInfo.expiredTime);
              }
              
             
        },
        fail:(error)=>{
          
        }
      })
  },
  startcountDate:function(date){
    //const time = CAlculagraph.CAlculagraph();
    const that = this;
    this.time_cal = new CAlculagraph({
      deadline:date/1000,//最终结束的时间戳,
      callback:function (){
        console.log(3333)
       that.date()
      },//时间结束
      that:this
    });
  },
  //判断时间
  date:function(){
    console.log(7777)
    let timestamp=new Date().getTime();
    if(timestamp>this.data.detailInfo.expiredTime){
      console.log(this.data.titleObj)
      wx.setNavigationBarTitle({
        title:this.data.titleObj.CLOSED
      })
       let orderShowStatus = 'detailInfo.orderShowStatus';
      this.setData({
        [orderShowStatus]:'CLOSED'
      })

    }
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
