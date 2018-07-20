//orderConfirmation.js
//获取应用实例
const app = getApp()


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    arrivingTime:"",
    linkPhone:"",
    seatCoodlds:"",
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
    num: 1,
    month: "",
    day: "",
    week: "",
    time: '11:00',
    timeFlag: false,
    errorMessage: '',
    con: 1,
    meetingDetail: {},
    themeName: '',
    remind: '提前1天',
    phone: '',
    check: true,
    dialogShow: false,
    typeStatus: true,
    message: '用户取消支付',
    selectedTime: [],
    nowDate: '',
    meetDetailShow: false,
    indicatorDots: false,
    meetInfo: ['1', '2', '3', 4, 5, 7, 9, 9, 4, 5, 7, 9, 9],
    alertTime: 'THIRTY',
    order_pay: {},
    priceCount: '0',
    totalCount: '0',
    detailInfo: {},
    orderDate: {},
    meeting_time: {},
    isFirst: true,
    errorMessage: '',
    checkMessage: false,
    dialogDate: false,
    nowDateIndex: wx.getStorageSync('nowDateIndex'),
    topDate: wx.getStorageSync('topDate'),
    ifFirst: false,
  },
  all_day_num: 0,
  last_btn_num: 'false',
  last_data: 'false',
  choose_date: '',
  isSubTime: false,
  ifFixed: false,
  //立即支付
  // payOrder: function () {
    
  //   let orderId = this.data.orderId;
  //   app.getRequest({
  //     url: app.globalData.KrUrl + 'api/gateway/krmting/order/pay',
  //     method: "POST",
  //     data: {
  //       // orderId: orderId,
  //       orderId:37551,
  //       // alertTime:alertTime,
  //       // arrivingTime:arrivingTime,
  //       // linkPhone:linkPhone,
  //       // seatCoodlds:seatCoodlds,
  //     },
  //     success: (res) => {
  //       var _this = this;
  //       console.log("订单信息",res)
  //       wx.reportAnalytics('confirmorder')
        
  //       // 微信支付
  //       wx.requestPayment({
  //         'timeStamp': res.data.data.timestamp,
  //         'nonceStr': res.data.data.noncestr,
  //         'package': res.data.data.packages,
  //         'signType': res.data.data.signType,
  //         'paySign': res.data.data.paySign,
  //         'success': function (res) {
  //           wx.showLoading({
  //             title: '加载中',
  //             mask: true
  //           })
  //           setTimeout(
  //             function () {
  //               _this.getInviteeId(orderId, _this.jumpPaySuccess)
  //               wx.hideLoading()
  //             }, 1500)
  //         },
  //         'fail': function (res) {}
  //       })
  //     },
  //     fail: (error) => {
          
  //     }
  //   })

  // },
  // 立即支付成功后
  jumpPaySuccess:function(inviteeId){
    wx.navigateTo({
      url: '../paySuccess/paySuccess?inviteeId='+inviteeId
    })
  },
  // 预计到场时间选择
  jumpSetTheme: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    }) 
   },
  // 预计到场时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //  预计到场时间 隐藏
  jumpSetTime: function () {
    this.setData({
       timeFlag: !this.data.timeFlag
    }) 
   },
  // 散座详情 弹窗
  openMeetDetail:function(e){
      let detailInfo=this.data.detailInfo;
      let that = this;
      wx.reportAnalytics('goodsdetails')
  
      this.setData({
        meetingRoomId:detailInfo.meetingRoomId,
        meetDetailShow:!this.data.meetDetailShow
      },function(){
        that.getMeetDetail()
      })
  },
  // 散座详情 轮播图
  currentChange: function (e) {
  if (e.detail.source == "touch") {
    this.setData({
      currentNum: e.detail.current + 1
    })
  }
},
  // 散座与详情 关闭
  closeMeetDetail:function(){
    this.setData({
      meetingRoomId:'',
      meetDetailShow:!this.data.meetDetailShow
    })
},
  // 行程提醒
  getRemind: function (alertTime) {
  let themeObj = {
    'NOALERT': '无',
    'FIVE': '提前一小时',
    'FIFTEEN': '提前两小时',
    'THIRTY': '提前一天',
    'THIRTYS': '提前两天',
  }
   return themeObj[alertTime]
  
},
  // 行程提醒
  jumpSetRemind: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../warn/warn?type=storage&alertTime=' + data.alertTime
    })
   
  },
  // 联系电话
  // jumpSetPhone:function() {
  //   let detailInfo=this.data.detailInfo;
  //   if(detailInfo.orderShowStatus==3){
  //     return;
  //   }
  //   wx.navigateTo({
  //     url: '../phone/phone?linkPhone='+detailInfo.linkPhone+'&type=submit'+'&orderId='+this.data.orderId
  //   })
  // },
  jumpSetPhone:function() {
    let data=this.data;
    wx.navigateTo({
      url: '../phone/phone?type=storage&linkPhone='+data.linkPhone
    })
    
  },
  // 邀请
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

  //查看散座
  jumpMeet:function() {
  wx.navigateTo({
    url: '../mysanzuo/mysanzuo'
  })
},
  onUnload: function () {
    if(this.data.con==1){
      wx.reLaunch({
        url: '../index/index'
      })
    }
    let _this = this;
    
    wx.setStorage({
      key: "order_pay",
      data: {},
      success: function () {
          _this.setData({
          order_pay: {}
          })
      }
    })
    wx.setStorage({
      key: "meeting_time",
      data: {}
    })
    
  },
  //滑动事件
  scrollTopEvent(e){
    let top=e.detail.scrollTop;
    
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
  getMeetId() {
    let that = this;
    wx.getStorage({
        key: 'detail-c',
      success: function (res) {
        if (res.data) {
            that.setData({
            meetingRoomId: res.data.meetingRoomId
          }, function () {
              that.getMeetDetail();
            })
          }
        }
    })
  },
  getBoardroomTime: function () {  
  },
  stopPropagation: function () {
    return;
  },
 
  //  查看散座
//   jumpMeetingStatus:function(inviteeId){
//     wx.navigateTo({
//       // url: '../meetingStatus/meetingStatus?inviteeId='+inviteeId
//     })
// },


//     jumpMeetingDetail:function(inviteeId){
//       wx.navigateTo({
//         // url: '../meetingDetail/meetingDetail?inviteeId='+inviteeId
//       })
//     },


//   jumpMeet:function() {
//   let detailInfo=this.data.detailInfo;
 
//   if(detailInfo.join){
//     this.getInviteeId(detailInfo.orderId,this.jumpMeetingDetail)
//   }else{
//     this.getInviteeId(detailInfo.orderId,this.jumpMeetingStatus)
//   } 
// },
  

   
   

  onShow: function () {
    this.getDetailInfo(this.data.orderId)
    var _this = this;
    this.getMeetId()
    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime) || _this.getRemind('THIRTY'),
            linkPhone: res.data.linkPhone || _this.data.linkPhone,
            order_pay: res.data,
            alertTime: res.data.alertTime || 'THIRTY'
            })
        }
      }
    })
  },
  bool: true,
  onLoad: function (options) {
    console.log(options)
    if(options.con){
      this.setData({
        orderId:options.id,
        con:options.con
      })
    }else{
      this.setData({
        orderId:options.id
      })
    }
    // this.setData({
    //       orderId:options.id,
    //       con:options.con
    //     })


    let num = wx.getStorageSync("num")
    let month = wx.getStorageSync("month")
    let day = wx.getStorageSync("day")
    let week = wx.getStorageSync("week")


      this.setData({
      num: num||1,
      month: month,
      day: day,
      week: week
      })

    this.getPhone();
    var _this = this;
    if (options.from == 'list') {
      wx.getStorage({
        key: 'meet_detail',
        success: function (res) {
          if (res.data) {

            _this.setData({
              detailInfo: res.data
              })
          }
        }
      })
    } else {
        wx.getStorage({
        key: 'detail',
        success: function (res) {
          if (res.data) {
              _this.setData({
              detailInfo: res.data
                })
            }
          }
        })
    }
    

    wx.getStorage({
      key: 'orderDate',
      success: function (res) {
        if (res.data) {
          _this.getThemeName(res.data);
         
        }
      }
    })
    wx.getStorage({
      key: 'meeting_time',
      success: function (res) {
        if (res.data) {
          _this.setData({
            meeting_time: res.data
          })
        }
      }
    })
   
    // wx.getStorage({
    //   key: 'order_pay',
    //   success: function (res) {
    //     if (Object.keys(res.data).length != 0) {
    //       _this.setData({
    //         themeName: res.data.themeName || _this.data.themeName,
    //         remind: _this.getRemind(res.data.alertTime),
    //         linkPhone: res.data.linkPhone || _this.data.linkPhone
    //         })
    //     }
    //   }
    // })
    
    
    this.setData({
      nowDate: wx.getStorageSync('nowDate'),
      nowDateIndex: wx.getStorageSync('nowDateIndex'),
      topDate: wx.getStorageSync('topDate'),
    })
    
  },
  getThemeName: function (res) {
    let timeArr = res.time.split('-');
    let month = timeArr[1];
    let day = timeArr[2];
          // if(month<10){
          //   month=`0${month}`
          // }
          // if(day<10){
          //   day=`0${day}`
          // }
    let date = `${month}${day}`;
          
    let themeName = date + '会议';
          this.setData({
      orderDate: res,
      themeName: themeName
          });
         
          this.choose_date = res.time
  },

  
  getPhone: function () {
    var _this = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
      methods: "GET",
      header: {
        'content-type': "appication/json"
        },
      success: (res) => {
        let userInfo = Object.assign({}, res.data.data);
        let linkPhone = _this.data.linkPhone;
          _this.setData({
          linkPhone: userInfo.phone || linkPhone
          })
        }
    })
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
  preventTouchMove() {},



  // getDetailInfo:function(orderId){
  getDetailInfo:function(){
    const _this=this;
    app.getRequest({
        // url:app.globalData.KrUrl+'api/gateway/krmting/order/detail',
        url:app.globalData.KrUrl+' api/gateway/krseat/seat/order/detail',
        method:"GET",
      data:{
        orderId:175
      },
      success:(res)=>{
            console.log("订单详情接口",res)
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
                'NOALERT': '无',
                'FIVE': '提前一小时',
                'FIFTEEN': '提前两小时',
                'THIRTY': '提前一天',
                'THIRTYS': '提前两天',
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
          //     wx.setNavigationBarTitle({
          //       title: titleObj[data.orderShowStatus]
          // })
              if(data.orderShowStatus=='OBLIGATION'){
                  _this.startcountDate(detailInfo.expiredTime);
        }
          
             
        },
        fail:(error)=>{
          
      }
    })
  },
  startcountDate:function(date){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:date/1000,//最终结束的时间戳,
      callback:function (){
       that.date()
      },//时间结束
      that:this
    });
  },
  //判断时间
  date:function(){
    let timestamp=new Date().getTime();
    if(timestamp>this.data.detailInfo.expiredTime){
      console.log(this.data.titleObj)
      // wx.setNavigationBarTitle({
      //   title:this.data.titleObj.CLOSED
      // })
       let orderShowStatus = 'detailInfo.orderShowStatus';
      this.setData({
        [orderShowStatus]:'CLOSED'
      })
    
    }
  },




  getMeetDetail() {
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;

    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/goods/detail',
      method: "GET",
      data: {
        "seatGoodsId":meetingRoomId 
      },
      success: (res) => {
        console.log(res)
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;

          that.setData({
            meetingDetail: meetingDetail
          })
        } else {
          that.setData({
            phoneError: false,
            errorMessage: res.data.message,
          })
          setTimeout(function () {
            that.setData({
              phoneError: true,
              errorMessage: '',

            })
          }, 2000)
        }

      },
      fail: (res) => {

        that.setData({
          phoneError: false,
          errorMessage: res.message,
        })
        setTimeout(function () {
          that.setData({
            phoneError: true,
            errorMessage: '',

          })
        }, 2000)

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




   
