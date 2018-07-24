const app = getApp()


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    price: "",
    timeweekArr: {},
    carendarArr: [],
    daynum: "",
    sankeNum: 1,
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
    autoplay: false,
    duration: 1000,
    currentNum: 1,
    timeText: '',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    meetInfo: ['1', '2', '3', 4, 5, 7, 9, 9, 4, 5, 7, 9, 9],
    meetingRoomId: '',
    alertTime: 'ONEDAY',
    order_pay: {},
    priceCount: '0',
    totalCount: '0',
    detailInfo: {}, //初始化遍历对象
    orderDate: {},
    meeting_time: {},
    isFirst: true,
    errorMessage: '',
    checkMessage: false,
    dialogDate: false, //判断门板是否显示
    nowDateIndex: wx.getStorageSync('nowDateIndex'),
    topDate: wx.getStorageSync('topDate'),

    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1: [], //便利日历的两条数组
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
  // 散座详情弹窗
  openMeetDetail: function (e) {
    let that = this;
    that.setData({
      meetingRoomId: '',
      meetDetailShow: !this.data.meetDetailShow
    }, function () {
      that.getMeetId()
    })
  },
  // 预计到场时间选择
  jumpSetTheme: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    })
  },
  // 预计到场时间显示
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 预计到场时间隐藏
  jumpSetTime: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    })
  },
  // 数量日历显示与隐藏
  closeDialogDate: function () {
    wx.navigateTo({
      url: "../meeting/meeting"
    })
    //  let that = this;
    //  that.setData({
    //    dialogDate:!that.data.dialogDate
    //  })
  },
  // 数量与日期  隐藏
  closeDialogDate: function () {
    wx.navigateTo({
      url: "../meeting/meeting"
    })
    // let that = this;
    // wx.reportAnalytics('choosedate')
    // that.setData({
    //   dialogDate:!that.data.dialogDate
    // })
  },
  // 我在想想
  closeDialog: function () {
    this.setData({
      dialogShow: !this.data.dialogShow,
    })
  
  },
  // 立即支付按钮
  goToPay: function () {
    let data = this.data;
    var _this = this;
    if (!data.check) {
      this.setData({
        checkMessage: true,
        errorMessage: '请阅读并同意KrMeeing服务须知'
      })
      setTimeout(function () {
        _this.setData({
          checkMessage: false,
          errorMessage: ''
        })
      }, 2000)
      return
    }

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
  // 滑动事件
  scrollTopEvent(e) {
    let top = e.detail.scrollTop;

    if (top >= 145) {
      this.setData({
        ifFixed: true
      })
    } else {
      this.setData({
        ifFixed: false
      })
    }

  },
  // 选中按钮
  changeCheckbox: function () {
    this.setData({
      check: !this.data.check
    })
  },
  // 散座详情里 阴影部分
  closeMeetDetail: function () {
    this.setData({
      meetingRoomId: '',
      meetDetailShow: !this.data.meetDetailShow
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
  // 默认的 行程提醒 
  getRemind: function (alertTime) {
    let themeObj = {
      'NOALERT': '无',
      'ONEHOUR': '提前一小时',
      'TWOHOUR': '提前两小时',
      'ONEDAY': '提前一天',
      'TWODAY': '提前两天',
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
  // 手机号 
  jumpSetPhone: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../phone/phone?type=storage&linkPhone=' + data.linkPhone
    })

  },
  //查看服务须知
  goToGuide: function () {
    wx.navigateTo({
      url: '../guide/guide'
    })
  },
  //获取 id
  getMeetId() {
    let that = this;
    wx.getStorage({
      key: 'detail-c',
      success: function (res) {
        if (res.data) {
          that.setData({
            meetingRoomId: res.data.id
          }, function () {
            that.getMeetDetail();
          })
        }
      }
    })
  },
  // 获取详情
  getMeetDetail() {
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/goods/detail',
      method: "GET",
      data: {
        "seatGoodsId": meetingRoomId
      },
      success: (res) => {
        console.log("散客详情1", res)
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;
          that.setData({
            meetingDetail: meetingDetail
          })
          let price = this.data.sankeNum * this.data.daynum * meetingDetail.promotionCost
          let oldprice = this.data.sankeNum * this.data.daynum * meetingDetail.unitCost
          that.setData({
            price: price.toFixed(2),
            oldprice: oldprice.toFixed(2)
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




  
  onLoad: function (options) {
    this.getMeetId()

    let carendar = wx.getStorageSync("data-index")

    for (var item in carendar) {

    }

    this.setData({
      sankeNum: carendar[0].number_a,
      daynum: carendar.length,
      carendarArr: carendar,
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
        key: 'detail-c',
        success: function (res) {
          // console.log(res)
          if (res.data) {
            _this.setData({
              detailInfo: res.data //当前散座的一系列数据
            })
          }
        }
      })
    }


    wx.getStorage({ //获取今天
      key: 'orderDate',
      success: function (res) {
        if (res.data) {
          _this.getThemeName(res.data);
        }
      }
    })
    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime),
            linkPhone: res.data.linkPhone || _this.data.linkPhone
          })
        }
      }
    })
    this.setData({
      nowDate: wx.getStorageSync('nowDate'),
      nowDateIndex: wx.getStorageSync('nowDateIndex'),
      topDate: wx.getStorageSync('topDate'),
    })
  },
  onShow: function () {
    var _this = this;
    this.getMeetId()

    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime) || _this.getRemind('ONEDAY'),
            linkPhone: res.data.linkPhone || _this.data.linkPhone,
            order_pay: res.data,
            alertTime: res.data.alertTime || 'ONEDAY'
          })
        }
      }
    })
  },
  onUnload: function () {
    let _this = this;

    // wx.setStorage({
    //   key:"order_pay",
    //   data:{},
    //   success:function(){
    //       _this.setData({
    //         order_pay:{}
    //       })
    //   }
    // })

  },


  bool: true,
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
    let date = `${month}${day}`; //0716
    let themeName = date + '会议'; //0716会议
    this.setData({
      orderDate: res, //今天time:"2018-07-16"timeText:"今天"
      themeName: themeName //0716会议
    });
    this.choose_date = res.time //2018-07-16
    
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
        // console.log(res)//code
        let userInfo = Object.assign({}, res.data.data);
        let linkPhone = _this.data.linkPhone;
        _this.setData({
          linkPhone: userInfo.phone || linkPhone
        })
      }
    })
  },
 // 去支付
 createOrder: function () {
  this.setData({
    dialogShow: !this.data.dialogShow,
  })

  let data = this.data;
  // console.log(data.alertTime);
  let orderData = {

    alertTime: data.alertTime,
    linkPhone: data.order_pay.linkPhone || data.linkPhone,
    arrivingTime: data.time,
    quantity: data.sankeNum,
    seatGoodIds: "135,136"

  }

  if (!wx.getStorageSync("myorder")) {
    let orderArr = []
    orderArr.push(orderData)
    wx.setStorageSync("myorder", orderArr)
  } else {
    let orderseat = wx.getStorageSync("myorder")
    orderseat.push(orderData)
    wx.setStorageSync("myorder", orderseat)
  }

  wx.showLoading({
    title: '加载中',
    mask: true
  })

  var _this = this;
  app.getRequest({
    // 散座下单
    url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/create',
    methods: "GET",
    header: {
      'content-type': "appication/json"
    },
    data: orderData,

    success: (res) => {
      console.log("散客", res)



      if (!wx.getStorageSync("order-info")) {
        let orderArr = []
        orderArr.push(res.data.data)
        wx.setStorageSync("order-info", orderArr)
      } else {
        let orderseat = wx.getStorageSync("order-info")
        orderseat.push(res.data.data)
        wx.setStorageSync("order-info", orderseat)
      }





      // console.log(res)
      wx.setStorageSync("order", res.data.data)
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
          // wx.reportAnalytics('confirmorder')

          wx.requestPayment({
            'nonceStr': res.data.data.noncestr,
            'orderId': res.data.data.orderId,
            'package': res.data.data.packages,
            'paySign': res.data.data.paySign,
            'signType': res.data.data.signType,
            'timeStamp': res.data.data.timestamp,


            'success': function (response) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                // _this.getInviteeId(res.data.data.orderId);
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
                wx.hideLoading();
              }, 1500)

            },
            'fail': function (response) {

              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                wx.hideLoading();
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
              }, 1500)

            },

          })
          // _this.weChatPay(res.data.data);
          // _this.closeDialog();
          // wx.setStorage({
          //   key:"order_pay",
          //   data:{},
          //   success:function(){
          //       _this.setData({
          //         order_pay:{}
          //       })
          //   }
          // })
          break;
      }

    },

  })

},
  

})