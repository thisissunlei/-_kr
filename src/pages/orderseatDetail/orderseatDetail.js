//orderConfirmation.js
//获取应用实例
const app = getApp()


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    alertTime:{},
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
    showError: true,
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
    messageShow: false,
    dialogTimeShow: true,
    rangeTime1: [],
    rangeTime2: [],
    rangeTime3: [],
    rangeTime: [],
    linkPhone: '',
    selectedTime: [],
    nowDate: '',
    meetDetailShow: false,
    indicatorDots: false,
    timeText: '',

    meetInfo: ['1', '2', '3', 4, 5, 7, 9, 9, 4, 5, 7, 9, 9],
    meetingRoomId: '',
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

    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1: [],
    date_data2: [],
    date_now: {
      month: '',
      year: '',
      value: ''
  },
    date_next: {
      month: '',
      year: '',
      value: ''
    },
    ifFirst: false,
  },
  all_day_num: 0,
  last_btn_num: 'false',
  last_data: 'false',
  choose_date: '',
  rangeTime: [],
  selectedTime: [],
  isSubTime: false,
  ifFixed: false,
  payOrder: function () {
    
    let orderId = this.data.orderId;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/pay',
      method: "POST",
      data: {
        orderId: orderId,
        // alertTime:alertTime,
        // arrivingTime:arrivingTime,
        // linkPhone:linkPhone,
        // seatCoodlds:seatCoodlds,
      },
      success: (res) => {
        var _this = this;
        console.log("订单信息",res)
        wx.reportAnalytics('confirmorder')
        wx.requestPayment({
          'timeStamp': res.data.data.timestamp,
          'nonceStr': res.data.data.noncestr,
          'package': res.data.data.packages,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            setTimeout(
              function () {
                _this.getInviteeId(orderId, _this.jumpPaySuccess)
                wx.hideLoading()
              }, 1500)
          },
          'fail': function (res) {}
        })
      },
      fail: (error) => {
          
      }
    })

  },
  //   散座详情弹窗
  // openMeetDetail: function (e) {
  //   let that = this;
  //   this.setData({
  //     meetingRoomId: '',
  //     meetDetailShow: !this.data.meetDetailShow
  //   }, function () {
  //     that.getMeetId()
  //   })
  // },
  
  // 预计到场时间选择
  jumpSetTheme: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    }) 
   },
   //  预计到场时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },



  // 
  goToPay: function () {
    let data = this.data;
    var _this = this;
  
    if (!data.linkPhone) {
          this.setData({
        checkMessage: true,
        errorMessage: '请填写联系电话'
          })
      setTimeout(function () {
            _this.setData({
          checkMessage: false,
          errorMessage: ''
            })
      }, 2000)
          return
      }
      this.closeDialog();
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
 
  currentChange: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentNum: e.detail.current + 1
      })
    }
  },
  
  getMeetId() {
    let that = this;
    wx.getStorage({
        key: 'detail',
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

  changeCheckbox: function () {
    this.setData({
      check: !this.data.check
    })
  },
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
  jumpSetTime: function () {
   this.setData({
      timeFlag: !this.data.timeFlag
   }) 
  },
  jumpSetRemind: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../warn/warn?type=storage&alertTime=' + data.alertTime
    })
   
  },
  jumpSetPhone: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../phone/phone?type=storage&linkPhone=' + data.linkPhone
    })
    
  },
  getBoardroomTime: function () {
    
  },

  tapTime: function (e) {
    
    var indexParam = e.currentTarget.dataset.index;
   
    var test = [].concat(this.data.rangeTime);
   
    // var selectedTime = this.data.selectedTime;
    var selectedTime = [];
    var rangeTime = [];
    
    for (let i = 0; i < test.length; i++) {
      //重点
      var item = Object.assign({}, test[i]);
      if (!item.disabled && item.number == indexParam) {
        item.actived = !item.actived; 
      }
      if (item.actived) {
        selectedTime.push(item.number);
      }
      rangeTime.push(item);
    }
    var bool = true;
    if (selectedTime.length > 1) {
      for (let i = 0; i < selectedTime.length - 1; i++) {
        var a = selectedTime[i + 1] - selectedTime[i];
        if (Math.abs(a) != 1) {
            bool = false;
          break;
          }
        }
    }
    var that = this;
    
    
    if (bool) {
      this.setData({
        rangeTime1: [].concat(rangeTime.slice(0, 8)),
        rangeTime2: [].concat(rangeTime.slice(8, 16)),
        rangeTime3: [].concat(rangeTime.slice(16)),
        rangeTime: [].concat(rangeTime),
        selectedTime: [].concat(selectedTime),
        meeting_time: {
          time: selectedTime[0] ? (getTime(selectedTime[0]) + '-' + getTime(Number(selectedTime[selectedTime.length - 1]) + 1)) : '',
          beginTime: selectedTime[0] ? (that.data.orderDate.time + ' ' + getTime(selectedTime[0]) + ':00') : '',
          endTime: selectedTime[0] ? (that.data.orderDate.time + ' ' + getTime(Number(selectedTime[selectedTime.length - 1]) + 1) + ':00') : '',
          hours: selectedTime[0] ? getHour(selectedTime) : 0
        }
      })
    } else {
      this.setData({
        showError: false,
        errorMessage: '请选择连续时间段'
      })
      setTimeout(function () {
        that.setData({
          showError: true,
          errorMessage: ''
        })
      }, 2000)
      // wx.showToast({
      //   title: '请选择连续时间段',
      //   icon: 'none',
      //   duration: 1000
      // })
      return;
    }
  },
  stopPropagation: function () {
    return;
  },
 


    //邀请
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
          // url: '../meetingStatus/meetingStatus?inviteeId='+inviteeId
          url: '../mysanzuo/mysanzuo?inviteeId='+inviteeId
        })
    },
    jumpMeet:function() {
      wx.navigateTo({
        url: '../mysanzuo/mysanzuo'
      })

      // let detailInfo=this.data.detailInfo;
     
      // if(detailInfo.join){
      //   this.getInviteeId(detailInfo.orderId,this.jumpMeetingDetail)
      // }else{
      //   this.getInviteeId(detailInfo.orderId,this.jumpMeetingStatus)
      // }
     
      
    },
  
    jumpMeetingDetail:function(inviteeId){
      wx.navigateTo({
        // url: '../meetingDetail/meetingDetail?inviteeId='+inviteeId
        url: '../mysanzuo/mysanzuo?inviteeId='+inviteeId
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
          _this.getNowRangeTime();
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


  closeDialogTime: function () {
    var that = this;
    if (!that.data.dialogTimeShow) {
      // that.getMeetDetail();
      that.getNowRangeTime();
      this.isSubTime = false;
      this.rangeTime = [].concat(this.data.rangeTime);
      this.selectedTime = [].concat(this.data.selectedTime);
    } else {
      if (!this.isSubTime) {
        var rangeTime = this.rangeTime;
        var selectedTime = this.selectedTime;
        this.setData({
          rangeTime1: [].concat(rangeTime.slice(0, 8)),
          rangeTime2: [].concat(rangeTime.slice(8, 16)),
          rangeTime3: [].concat(rangeTime.slice(16)),
          rangeTime: [].concat(rangeTime),
          selectedTime: [].concat(selectedTime),
          meeting_time: {
            time: selectedTime[0] ? (getTime(selectedTime[0]) + '-' + getTime(Number(selectedTime[selectedTime.length - 1]) + 1)) : '',
            beginTime: selectedTime[0] ? (that.data.orderDate.time + ' ' + getTime(selectedTime[0]) + ':00') : '',
            endTime: selectedTime[0] ? (that.data.orderDate.time + ' ' + getTime(Number(selectedTime[selectedTime.length - 1]) + 1) + ':00') : '',
            hours: selectedTime[0] ? getHour(selectedTime) : 0
          }
        })
      }
    }
    this.setData({
      dialogTimeShow: !that.data.dialogTimeShow
    })
    if (!this.data.dialogTimeShow) {
      this.getPhone()
    }
    
  },
  getNowRangeTime: function () {
    var id = this.data.detailInfo.meetingRoomId;
    var that = this;
    var disableTime = [];
    var newRangeTime = [];
    // wx.showLoading({
    //   title: '加载中',
    // })
   
    //过滤已过去的时间
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let limitTime = 2 * hours + 1 + (minutes > 29 ? 1 : 0);
    var selectedTime = this.data.selectedTime;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/room/disableTime',
      methods: "GET",
      data: {
        date: that.data.orderDate.time,
        meetingRoomId: id
      },
      header: {
        'content-type': "appication/json"
      },
      success: (res) => {
        disableTime = res.data.data.disableTime;
        for (let i = 19; i < 39; i++) {
          var rangeTimeItem = {
            disabled: false,
            number: i,
            actived: false,
          };
          newRangeTime.push(rangeTimeItem);
        }
        newRangeTime.forEach((timeItem, timeIndex) => {
          if (disableTime.indexOf(timeItem.number) > -1) { //过滤已过去的时间
                timeItem.disabled = true;
            }
          if (that.data.orderDate.timeText == "今天" && timeItem.number < limitTime) {
                timeItem.disabled = true;
            }
          if (selectedTime.indexOf(timeItem.number) > -1) {
                timeItem.actived = true;
            }
        });
        that.setData({
          rangeTime1: newRangeTime.slice(0, 8),
          rangeTime2: newRangeTime.slice(8, 16),
          rangeTime3: newRangeTime.slice(16),
          rangeTime: newRangeTime,
        }, function () {
          wx.hideLoading();
        })
      }
    })
    
    
  },
  createOrder: function () {
    let data = this.data;
    let orderData = {
      alertTime: data.order_pay.alertTime || data.alertTime,
      beginTime: data.meeting_time.beginTime,
      endTime: data.meeting_time.endTime,
      linkPhone: data.order_pay.linkPhone || data.linkPhone,
      meetingRoomId: data.detailInfo.meetingRoomId,
      themeName: data.order_pay.themeName || data.themeName
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    
    var _this = this;
        app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/create',
      methods: "GET",
      header: {
        'content-type': "appication/json"
          },
      data: orderData,
          
      success: (res) => {
        let code = res.data.code;
        setTimeout(function () {
              wx.hideLoading();
        }, 1500)
        switch (code) {
              case -1:
                  this.setData({
              checkMessage: true,
              errorMessage: res.data.message
                  })
            setTimeout(function () {
                    _this.setData({
                checkMessage: false,
                errorMessage: ''
                    })
            }, 2000)
              break;
              case -2:
                wx.setStorage({
              key: "create_order",
                  data: {
                create_order: orderData
                  },
                })
                  wx.navigateTo({
                    url: '../bindPhone/bindPhone'
                  })
              break;
              case -3:
                  this.setData({
              checkMessage: true,
              errorMessage: res.data.message,
              selectedTime: [],
              meeting_time: {
                time: '',
                beginTime: '',
                endTime: '',
                hours: 0,
                    }
                  })
            setTimeout(function () {
                    _this.setData({
                checkMessage: false,
                errorMessage: ''
                    })
            }, 2000)
              break;
              default:
                wx.reportAnalytics('confirmorder')

                _this.weChatPay(res.data.data);
                _this.closeDialog();
                  wx.setStorage({
              key: "order_pay",
              data: {},
              success: function () {
                        _this.setData({
                  order_pay: {}
                        })
                    }
                  })
              break;
            } 

          },
          
        })
       
  },
  weChatPay: function (data) {
    var _this = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/pay',
      methods: "POST",
      header: {
        'content-type': "appication/json"
      },
      data: {
        orderId: data.orderId
      },
      success: (res) => {
          wx.requestPayment({
          'timeStamp': data.timestamp,
            'nonceStr': data.noncestr,
            'package': data.packages,
            'signType': data.signType,
            'paySign': data.paySign,
          'success': function (response) {
                wx.showLoading({
                  title: '加载中',
              mask: true
                })
            setTimeout(function () {
                  _this.getInviteeId(data.orderId);
                  wx.hideLoading();
            }, 1500)
               
            },
          // 'fail': function (response) {
          //     wx.showLoading({
          //       title: '加载中',
          //     mask: true
          //     })
          //   setTimeout(function () {
          //       wx.hideLoading();
          //       wx.navigateTo({
          //       url: '../orderDetail/orderDetail?id=' + data.orderId + '&con=' + 1
          //       })
          //   }, 1500)
               
          //   },
           
          })
      }
    })
    
  },
  getInviteeId(orderId) {
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/order/invitee',
      methods: "GET",
      header: {
        'content-type': "appication/json"
      },
      data: {
        orderId: orderId
      },
      success: (res) => {
        if (res.data.data.inviteeId) {
          wx.navigateTo({
            url: '../paySuccess/paySuccess?inviteeId=' + res.data.data.inviteeId
          })
        } else {
          wx.navigateTo({
            url: '../orderDetail/orderDetail?id=' + orderId + '&con=' + 1
          })
        }

      }
    })

  },
    // getInviteeId(orderId,callback){
    //   app.getRequest({
    //     url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
    //     methods:"GET",
    //     header:{
    //       "content-type":"application/json"
    //     },
    //     data:{
    //       orderId:orderId
    //     },
    //     success:(res)=>{
    //       if(res.data.data.inviteeId){
    //           callback && callback(res.data.data.inviteeId);
    //       }
          
    //     }
    //   })
    // },
  preventTouchMove() {},

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
      url: app.globalData.KrUrl + 'api/gateway/krmting/room/detail',
      method: "GET",
      data: {
        "meetingRoomId": meetingRoomId
      },
      success: (res) => {
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

function getTime(time) {
  var timeObj = {
    '19': '9:00',
    '20': '9:30',
    '21': '10:00',
    '22': '10:30',
    '23': '11:00',
    '24': '11:30',
    '25': '12:00',
    '26': '12:30',
    '27': '13:00',
    '28': '13:30',
    '29': '14:00',
    '30': '14:30',
    '31': '15:00',
    '32': '15:30',
    '33': '16:00',
    '34': '16:30',
    '35': '17:00',
    '36': '17:30',
    '37': '18:00',
    '38': '18:30',
    '39': '19:00'
    }
    return timeObj[time];
  }

function getHour(data) {
  var len = data.length;
  return len * 0.5;
}

   
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