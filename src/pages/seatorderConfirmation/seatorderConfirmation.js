const app = getApp()
import {dateData,dateDataPrice} from '../../utils/dateData.js';


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    startTime:"",
    endTime:"",
    price_y:0,
    price_all:0,
    new_arrup:[],
    orderId:"",
    seatId:"",
    timeweekArr:{},
    carendarArr:[],
    daynum:"",
    sankeNum:1,
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
  
    linkPhone: '',
    selectedTime: [],
    
    meetDetailShow: false,
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum: 1,
    timeText: '',
    meetingRoomId: '',
    alertTime: 'ONEDAY',
    order_pay: {},
    priceCount: '0',
    totalCount: '0',
    detailInfo: {}, //初始化遍历对象
    orderDate: {},
    meeting_time: {},
    // isFirst: true,
    errorMessage: '',
    checkMessage: false,
    dialogDate: false, //判断门板是否显示
    nowDateIndex: wx.getStorageSync('nowDateIndex'),
    topDate: wx.getStorageSync('topDate'),
 
    
    ifFirst: false,

    // 日历
    
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    add_btn : true,
    reduce_btn : false,
    final_num : 1,
    show_a:false,
    selecedList:[],
  },

  nowDate: '',
  seatGoodIds:"",
  choose_date: '',
  selectedTime: [],
  isSubTime: false,
  ifFixed: false,
  combination_new:[],

  // 日历
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  james:'',
  // 散座s详情弹窗
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
      time: e.detail.value,
      timeFlag: !this.data.timeFlag
    })
  },
  // 预计到场时间隐藏
  jumpSetTime: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    })
  },
  // 数量日历显示与隐藏
   closeDialogDate:function(){
     this.setData({
       show_a:false
     })
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
      url: '../warnseat/warnseat?type=storage&alertTime=' + data.alertTime
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
            meetingRoomId: res.data.goodsId
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
        this.setData({
          startTime:res.data.data.startTime,
          endTime:res.data.data.endTime
        })
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
  // 用户状态
  getFirst(){
   
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/isFirstOrder',
      method: "GET",
      success: (res) => {
        // console.log(res.data.data.first,222)
      this.setData({
        isFirst:res.data.data.first
      })

      },
   
    })
  },

  dateBtn : function (e){
      let evlue = this.james.dateBtn(e);
      console.log('dateBtn',this.james.getValue())
      let selecedList = this.james.getValue()
      //console.log(this.date_data1)
        this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2, 
          selecedList: selecedList     
        });
     
  },
  diantrue(){
    var that = this;
    let selecedList = this.data.selecedList
    console.log('=======',selecedList)

    if(!selecedList.length){
      selecedList = this.james.getValue()
    }
    
     
    console.log('=======',selecedList)
    selecedList = selecedList.map((item,index)=>{
      if(item.alldata){
        item.alldata.number = that.data.final_num
        return item.alldata
      }else{
        item.number = that.data.final_num
        return item;
      }
      
    })
    this.combination_new= selecedList;
    let seatGoodIds=[]
    seatGoodIds = this.combination_new.map(item=>{
      return item.seat.goodsId
    })
    this.seatGoodIds = seatGoodIds.join(",")
    this.onClickDate(that);
    
    this.setData({
      show_a:true
    })
  },
  dealDate:function(init_date){
    
    let that = this;

    const today_date = new Date(init_date);
    //const today = today_date.getDate();

    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1);


    let init_month = today_month.getTime()
    app.getRequest({
      url:app.globalData.KrUrl+"api/gateway/krseat/seat/goods/list",
      methods:"GET",
      data:{
       seatId:this.data.seatId
      },
      success:res=>{
        let first = new Date(res.data.data.curMonth[0].useTime);
        const first_month = new Date(first.getFullYear(),first.getMonth(),1).getTime();
        let last_data = init_month == first_month?'date_data1':'date_data2'
        that.james = new dateDataPrice({
          //btn_bool:true,
          data: res.data.data,
          init_data: {
            last_btn_num: init_date, //日期
            last_data: last_data,
          },
        });
        this.date_data1 = that.james.date_data1;
        this.date_data2 = that.james.date_data2;

        this.setData({
          date_data1: this.date_data1,
          date_data2: this.date_data2,
        });
       
      }
    })
    
    
  },
  reduceNum:function(){
    const reduce_btn_f = this.james.reduceNum();
     let selecedList = this.james.getValue()
    this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2,
          selecedList: selecedList ,
          add_btn :  reduce_btn_f.final_bool,
          reduce_btn :  reduce_btn_f.final_r_bool,
          final_num : reduce_btn_f.final_num
        });
  },
  addNum:function(){
    const add_btn_f = this.james.addNum();
     let selecedList = this.james.getValue()
    this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2, 
          add_btn :  add_btn_f.final_bool,
          reduce_btn :  add_btn_f.final_r_bool,
          final_num : add_btn_f.final_num,
          selecedList: selecedList 
        });
    console.log(this.james.getValue())
  },


  // 页面加载
  onLoad: function (options) {
    

    this.show_true = options.show_true;
    this.nowDate = wx.getStorageSync('nowDate');
    this.setData({
      orderId:options.goodsId,
      seatId:options.seatId,
      
    })
    // 日历
    console.log('this.nowDate',this.nowDate)

     const today_date = new Date();
    
     const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
     const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    this.dealDate(this.nowDate);
     this.setData({
      
      date_now:{
        month:today_date.getMonth()+1,//月
        year:today_date.getFullYear(),//年
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月',  //年月
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月',
        choose:''
      }
    });




    
    this.getFirst()
    this.getMeetId()

    
    this.getPhone();

    var _this = this;

    if (options.from != 'list'){
      wx.getStorage({
        key: 'detail-c',
        success: function (res) {
         
          if (res.data) {
            _this.setData({
              detailInfo: res.data //当前散座的一系列数据
            })
          }
        }
      })
    }

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
  onClickDate: function (){
    let carendar = JSON.parse(JSON.stringify(this.combination_new));
    let price_all = 0;
    let price_y = 0;
    let number = 1;
    if(carendar){
      carendar.map(item=>{
        number = item.number;
        price_all = Number(price_all) + Number(item.seat.promotionCost*item.number);
        // console.log(typeof price_all)
        price_all =  price_all.toFixed(2);
        price_y  = Number(price_y) + Number(item.seat.unitCost*item.number);
        price_y  = price_y.toFixed(2)
         item.month=getzf(item.month) 
         item.value=getzf(item.value)
         item.seat.weeks =this.getWeek(item.seat.useTime)
         item.seat.dates = item.seat.useTimeDescr.slice(0,5);
        if(item.value=="今天"){
          item.month=getzf(parseInt(new Date().getMonth()+1))
          item.value=getzf(parseInt(new Date().getDate()))
          // item.zhou="今     天"
        }
        if(item.value=="明天"){
          item.month=getzf(parseInt(new Date().getMonth()+1))
          item.value=getzf(parseInt(new Date().getDate())+1)
          // item.zhou="明     天"
        }
        console.log(item)
        return item
      }) 
      
      // console.log(price_all,price_y,9999999)
      this.setData({
        sankeNum: number ,
        daynum: carendar.length,
        carendarArr: carendar,
        price_all:price_all,
        price_y:price_y
      })
    }
  },
  getWeek(init){
    var mydate=new Date(init); 
    var myday=mydate.getDay()
    let xingqi = ''
    switch(myday) { 
      case 0:xingqi="星期日";break; 
      case 1:xingqi="星期一";break; 
      case 2:xingqi="星期二";break; 
      case 3:xingqi="星期三";break; 
      case 4:xingqi="星期四";break; 
      case 5:xingqi="星期五";break; 
      case 6:xingqi="星期六";break; 
      default:xingqi="系统错误！" 
    } 
    return xingqi;

  },
  // 日历点击空白处隐藏
  heider : function(e){
    if(e.target.dataset.wrapper=='wrapper'){
      this.setData({
        show_a : true
      });
    }
    
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
      
      this.setData({
        carendarArr:{}
      })
  },
 // 去支付
 createOrder: function () {
  this.setData({
    dialogShow: !this.data.dialogShow,
  })

  let data = this.data;
  let that = this;
  let orderData = {

    alertTime: data.alertTime,
    linkPhone: data.order_pay.linkPhone || data.linkPhone,
    arrivingTime: data.time,
    quantity: data.sankeNum,
    seatGoodIds: that.seatGoodIds,

  }


    wx.setStorageSync("myorder", orderData)

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

      if (!wx.getStorageSync("order-info")) {
        let orderArr = []
        orderArr.push(res.data.data)
        wx.setStorageSync("order-info", orderArr)
      } else {
        let orderseat = wx.getStorageSync("order-info")
        orderseat.push(res.data.data)
        wx.setStorageSync("order-info", orderseat)
      }





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
            url: '../bindPhone/bindPhone?from=seat'
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
          break;
      }

    },

  })
  // 日历

  


},
  

})
//补0
function getzf(num){  
  if(parseInt(num) < 10){  
      num = '0'+num;  
  }  
  return num;  
}