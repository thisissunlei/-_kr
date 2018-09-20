//index.js
//获取应用实例
const app = getApp();
import {dateData,dateDataPrice} from '../../utils/calendar.js';

Page({
  onShareAppMessage: function() {
    return {
      title: "KrMeeting会议室，让会议更轻松、更简单",
      desc: "KrMeeting会议室",
      path: "pages/index/index",
      imageUrl: "../images/share_pic.jpg"
    };
  },
  onReachBottom:function(){
    this.loadNext();
  },
  stopPropagation:function(){
    return ;
  },
  data: {
    //数据模拟
    
    show_huiyi:"",
    arr: [],
    seatId:'',
    sanzuo: false,
    ifFixed: false,
    meeting_detail: {},
    dialogDate: false,
    hasUserInfo: false,
    boardroomList: [],
    topDate: [],
    page: 1,
    nextPage: 2,
    pageSize: 10,
    totalPages: 1,
    communityId: "1",
    dateScrollLeft: 0,
    nowDate: "",
    meetDetailShow: false,
    meetDetailShow1: false,
    meetingRoomId: "",
    meetingRoomId1: "",
    meetDetail: {},
    allDays: [],
    isToday: false,
    nowDateIndex: 0,
    communityList: [],
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum: 1,
    number: 10,
    meetInfo: ["1", "2", "3", 4, 5, 7, 9, 9, 4, 5, 7, 9, 9],
    splice: "666",
    scoll_arr:[],
    // 日历相关
    array: [
      {
        message: "foo"
      },
      {
        message: "bar"
      }
    ],
    date_data1: [],
    date_data2: [],
    date_now: { month: "", year: "", value: "" },
    date_next: { month: "", year: "", value: "" },
    meetingDetail: {},
    detail: {
      address: "社区地址", //社区地址
      buildName: "大厦名称", //大厦名称
      capacity: "容纳人数", //容纳人数
      device: [
        {
          icon: "",
          name: "沙发"
        }
      ], //设备列表
      floor: "楼层", //楼层
      meetingRoomName: "会议室名称", //会议室名称
      promotionCost: "促销单价", //促销单价
      promotionDescr: "促销描述", //促销描述
      roomImg: [
        "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg"
      ], //会议室图片
      unitCost: "销售单价" // 销售单价(元
    }
  },
  index_x: "",
  date_data1:[],
  date_data2:[],
  button_boolean: true,
  button_boolean1: true,
  james:'',
   // 日历相关
  all_day_num: 0,
  last_btn_num: "false",
  last_data: "date_data1",
  scrollTopEvent(e) {
    let top = e.detail.scrollTop;

    if (top >= 145) {
      this.setData({
        ifFixed: true
      });
    } else {
      this.setData({
        ifFixed: false
      });
    }
  },
  
  //预定跳转页面
  list(e) {
    let rangeTime = e.currentTarget.dataset.rangetime;
    let detail = e.currentTarget.dataset.detail;
    let id = 111;
    wx.setStorageSync("rangeTime-c", rangeTime);
    wx.setStorageSync("detail-c", detail);
    wx.navigateTo({
      url:
        "/pages/seatorderConfirmation/seatorderConfirmation?goodsId=" +e.currentTarget.dataset.detail.goodsId+'&seatId='+e.currentTarget.dataset.detail.seatId+'&show_true='+true
    });
  },
  //散座
  openMeetDetail1: function(e) {
    wx.showLoading({
      title: "加载中"
    });
    let that = this;
    let id = e.currentTarget.dataset.item.goodsId;
    let detail = e.currentTarget.dataset.item;
    this.setData(
      {
        seatId:e.currentTarget.dataset.item.seatId,
        meetingRoomId1: id,
        meetDetailShow1: !this.data.meetDetailShow1,
        meetDetail: detail
      },
      function() {
        that.getMeetDetail1();
      }
    );
  },
  
  //会议
  openMeetDetail: function(e) {
    wx.showLoading({
      title: "加载中"
    });
    let that = this;
    let id = e.currentTarget.dataset.item.meetingRoomId;
    let detail = e.currentTarget.dataset.item;
    this.setData(
      {
        meetingRoomId: id,
        meetDetailShow: !this.data.meetDetailShow,
        meetDetail: detail
      },
      function() {
        that.getMeetDetail();
      }
    );
  },
  //会议室门板
  closeMeetDetail: function() {
    this.setData({
      meetingRoomId: "",
      meetDetailShow: !this.data.meetDetailShow
    });
  },
  //散座门板
  closeMeetDetail1: function() {
    this.setData({
      meetingRoomId1: "",
      meetDetailShow1: !this.data.meetDetailShow1
    });
  },
  currentChange: function(e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentNum: e.detail.current + 1
      });
    }
  },
  scrollTopDate: function(date) {
    var topDate = this.data.topDate;
    var indexParam = 0;
    var that = this;
    let acticedObj = {}//选中的日期对象
    var newData = topDate.map((item, index) => {
      if (item.date == date) {
        item.actived = true;
        acticedObj = item;
        indexParam = index;
      } else {
        item.actived = false;
      }
      return item;
    });
    var orderDate = {
      time: acticedObj.date,
      timeText: acticedObj.week
    };
    console.log('scrollTopDate-----',orderDate)
    this.setData(
      {
        topDate: newData,
        dateScrollLeft: indexParam * 53,
        nowDate: acticedObj.date,
        nowDateIndex: indexParam
      },
      function() {
        that.getData();
        that.getData1();
        wx.setStorageSync("nowDate", acticedObj.date);
        wx.setStorageSync("orderDate", orderDate);
        wx.setStorageSync("nowDateIndex", indexParam);
      }
    );
  },
  //获取会议室列表
  getData: function() {
    let that = this;
    wx.showLoading({
      title: "加载中"
    });
    let arr = [];
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/room/list",
      methods: "GET",
      data: {
        communityId: that.data.communityId,
        date: that.data.nowDate,
        page: that.data.page,
        pageSize: that.data.pageSize
      },

      success: res => {
        if(res.data.data.items.length > 0){
          this.setData({
            show_huiyi : true
          })
        }else{
          this.setData({
            show_huiyi : false
          })
        }
        that.setData(
          {
            totalPages: res.data.data.totalPages,
            boardroomList: res.data.data.items,
            page: 1,
            nextPage: 2
          },
          function() {
            that.reloadData();
            wx.hideLoading();
          }
        );
        
        this.data.boardroomList.forEach(element => {
          wx.setNavigationBarTitle({
            title: element.buildName
          });
        });
      }
    });
  },
  //获取散座列表
  getData1: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/seat/goods/cmt",
      methods: "GET",
      data: {
        communityId: that.data.communityId,
        dateTime: that.data.nowDate
      },
      success: res => {
        
        
        var showData = res.data.data.goodsId?true:false;
        if(res.data.data.cmtImgUrls && res.data.data.cmtImgUrls.length){
          that.setData({
              scoll_arr:res.data.data.cmtImgUrls
          });
        }
        if(showData){
          let arr_null = [];
          arr_null.push(res.data.data);
          that.setData(
            {
              arr: arr_null,
              sanzuo: true,
              scoll_arr:res.data.data.cmtImgUrls
            },
            function() {
              that.reloadData();
              wx.hideLoading();
            }
          );
        }else{
          this.setData({
            sanzuo: false
          });
        }
        
      },
      fail:res=>{
        this.setData({
          sanzuo: true
        });
      }
    });
    
  },
  //切换日期后重载数据(会议室的时间刻度的状态处理)
  reloadData: function() {
    var boardroomList = this.data.boardroomList;

    //过滤已过去的时间
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let limitTime = 2 * hours + 1 + (minutes > 29 ? 1 : 0);
    var that = this;
    boardroomList.forEach((item, index) => {
      var rangeTime = [];
      for (let i = 19; i < 39; i++) {
        var rangeTimeItem = {
          disabled: false,
          number: i
        };
        rangeTime.push(rangeTimeItem);
      }
      item.rangeTime = rangeTime;
      item.rangeTime.forEach((timeItem, timeIndex) => {
        if (item.disableTime.indexOf(timeItem.number) > -1) {
          //过滤已过去的时间
          timeItem.disabled = true;
        }
        if (that.data.isToday) {
          if (timeItem.number < limitTime) {
            timeItem.disabled = true;
          }
        }
      });
    });
    this.setData({
      boardroomList: boardroomList
    });
  },
  getMonthDays: function(year, month) {
    //判断2月份天数
    var days;
    if (month == 2) {
      days = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
    } else {
      //1-7月 单数月为31日
      if (month <= 7) {
        days = month % 2 == 1 ? 31 : 30;
      } else {
        //8-12月 双月为31日
        days = month % 2 == 0 ? 31 : 30;
      }
    }
    return days;
  },
  getWeek: function(weekParam) {
    var week;
    switch (weekParam % 7) {
      case 0:
        week = "周日";
        break;
      case 1:
        week = "周一";
        break;
      case 2:
        week = "周二";
        break;
      case 3:
        week = "周三";
        break;
      case 4:
        week = "周四";
        break;
      case 5:
        week = "周五";
        break;
      case 6:
        week = "周六";
        break;

      default:
        break;
    }
    return week;
  },
  getDay(dayParam, totalDay) {
    if (totalDay % dayParam == totalDay && totalDay != dayParam) {
      return dayParam % totalDay;
    } else {
      return dayParam;
    }
  },
  getTopDate: function() {
    var topDate = [];
    var that = this;
    for (let i = 0; i < 30; i++) {
      var today = new Date();
      today.setDate(today.getDate() + i);
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var day = today.getDate();
      var totalDay = this.getMonthDays(year, month);
      var todayWeek = today.getDay();
      var dateItem = {
        week: "",
        day: "",
        actived: false,
        bool: true,
        date: `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`
      };
      if (i < 2) {
        dateItem.week = i == 0 ? "今天" : "明天";
      } else {
        dateItem.week = this.getWeek(todayWeek);
      }
      dateItem.day = this.getDay(day, totalDay);
      if (todayWeek % 7 == 0 || todayWeek % 7 == 6) {
        dateItem.class_bool = "btn_no";
        dateItem.bool = "false";
      } else {
        topDate.push(dateItem);
        topDate[0].actived = true;
      }
    }
    if (topDate[0].week == "今天") {
      this.setData({
        isToday: true
      });
    } else {
      this.setData({
        isToday: false
      });
    }
    // var _this = this;
    var orderDate = {
      time: topDate[0].date,
      timeText: topDate[0].week
    };
    this.setData(
      {
        topDate: topDate,
        nowDate: topDate[0].date,
        allDays: topDate,
        nowDateIndex: 0
      },
      function() {
        that.getData();
        that.getData1();
        wx.setStorageSync("nowDate", topDate[0].date);
        wx.setStorageSync("orderDate", orderDate);
        wx.setStorageSync("topDate", topDate);
        wx.setStorageSync("nowDateIndex", 0);
      }
    );

  },
  selectTopDate: function(e) {
    var topDate = this.data.topDate; //[]
    var indexParam = e.currentTarget.dataset.index;
    // this.changeTimeColor(indexParam);
    var date = e.currentTarget.dataset.date;
    var week = e.currentTarget.dataset.week;
    var type = e.currentTarget.dataset.type;
    this.last_data = type
    var that = this;
    var newData = topDate.map((item, index) => {
      if (index == indexParam) {
        item.actived = true;
      } else {
        item.actived = false;
      }
      return item;
    });
    if (indexParam == 0 && topDate[0].week == "今天") {
      this.setData({
        isToday: true
      });
    } else {
      this.setData({
        isToday: false
      });
    }
    var orderDate = {
      time: date,
      timeText: week
    };
    this.setData(
      {
        topDate: newData,
        nowDate: date,
        nowDateIndex: indexParam
      },
      function() {
        that.getData();
        that.getData1();
        that.dealDateList();
        wx.setStorageSync("nowDate", date);
        wx.setStorageSync("orderDate", orderDate);
        wx.setStorageSync("nowDateIndex", indexParam);
        wx.setStorageSync("topDate", newData);

      }
    );
  },
  //加载下一页会议室列表数据
  loadNext: function() {
    var communityList = this.data.communityList;
    var page = this.data.nextPage;
    var pageSize = this.data.pageSize;
    var totalPages = this.data.totalPages;
    if (page > totalPages) {
      return;
    }
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/room/list",
      methods: "GET",
      data: {
        communityId: that.data.communityId,
        date: that.data.nowDate,
        page: page,
        pageSize: that.data.pageSize
      },
      success: res => {
        that.setData(
          {
            boardroomList: [].concat(
              that.data.boardroomList,
              res.data.data.items
            ),
            nextPage: that.data.nextPage + 1
          },
          function() {
            that.reloadData();
          }
        );
      }
    });
  },
  //事件处理函数

  changeCommunity: function(e) {
    var communityList = this.data.communityList;
    var index = e.detail.value;
    wx.setNavigationBarTitle({
      title: communityList[index].name
    });
  },

  reserve: function(e) {
    var rangeTime = e.currentTarget.dataset.rangetime;
    var detail = e.currentTarget.dataset.detail;
    wx.setStorageSync("rangeTime", rangeTime);
    wx.setStorageSync("detail", detail);
    wx.navigateTo({
      url: "/pages/orderConfirmation/orderConfirmation"
      // url: '/pages/seatorderConfirmation/seatorderConfirmation'
    });
  },

  toBottom: function(e) {
    this.loadNext();
  },
  dateBtn: function(e) {
      let evlue = this.james.dateBtn(e);
      let selecedList = this.james.getValue();
      let closeDialog = this.james.getSwitch();
      let timeData = selecedList[0];
      //处理日历选中日期年-月-日
      let selecedTime = timeData.alldata.date_times;
      let year = new Date(selecedTime).getFullYear();
      let month = new Date(selecedTime).getMonth()+1;
      let day = timeData.alldata.day_num
      if(month<10){
        month = '0'+month
      }
      if(day<10){
        day = '0'+ day
      }
      let selecedDate = year+'-'+month+'-'+day;
      this.last_data = timeData.data
      // 结束
      
      if(closeDialog){
        this.scrollTopDate(selecedDate);
        this.closeDialogDate()
      }
  },
  closeDialogDate: function() {
    //未知，待定
    // wx.reportAnalytics('click')
    let that = this;
    this.dealDateList()
    that.setData({
      dialogDate: !that.data.dialogDate
    });
  },
  // dealDate: function(today_month, bool) {
  //   const week = today_month.getDay();
  //   const today = parseInt(new Date().getDate());
  //   today_month.setMonth(today_month.getMonth() + 1);
  //   today_month.setDate(0);
  //   const day_num = today_month.getDate() + week;
  //   const data = [];
  //   for (var i = 0; i < day_num; i++) {
  //     switch (true) {
  //       case i < week:
  //         data.push({
  //           value: ""
  //         });
  //         break;
  //       case i > today + week && bool:
  //         if (i % 7 == 0 || i % 7 == 6) {
  //           data.push({
  //             value: i - week + 1,
  //             day: i - week + 1,
  //             type: "before"
  //           });
  //         } else {
  //           data.push({
  //             value: i - week + 1,
  //             day: i - week + 1,
  //             type: "next"
  //           });
  //         }

  //         this.all_day_num++;
  //         break;
  //       case i == today + week - 1 && bool:
  //         if (i % 7 == 0 || i % 7 == 6) {
  //           data.push({
  //             value: "今天",
  //             day: i - week + 1,
  //             type: "before"
  //           });
  //         } else {
  //           data.push({
  //             value: "今天",
  //             day: i - week + 1,
  //             type: "now"
  //           });
  //         }
  //         this.all_day_num++;
  //         break;
  //       case i == today + week && bool:
  //         if (i % 7 == 0 || i % 7 == 6) {
  //           data.push({
  //             value: "明天",
  //             day: i - week + 1,
  //             type: "before"
  //           });
  //         } else {
  //           data.push({
  //             value: "明天",
  //             day: i - week + 1,
  //             type: "now"
  //           });
  //         }

  //         this.all_day_num++;
  //         break;
  //       case i < 30 - this.all_day_num + week && !bool:
  //         if (i % 7 == 0 || i % 7 == 6) {
  //           data.push({
  //             value: i - week + 1,
  //             day: i - week + 1,
  //             type: "before"
  //           });
  //         } else {
  //           data.push({
  //             value: i - week + 1,
  //             day: i - week + 1,
  //             type: "next"
  //           });
  //         }

  //         break;
  //       default:
  //         data.push({
  //           value: i - week + 1,
  //           day: i - week + 1,
  //           type: "before"
  //         });
  //       //this.all_day_num++;
  //     }
  //   }
  //   return data;
  // },

  onLoad: function(options) {
    wx.reportAnalytics("community");
    if (options.communityId) {
      this.setData({
        communityId: options.communityId
      });
    }
    //清除散座订单相关优惠信息
    wx.setStorageSync("seat_sale_info", {sale:false,card:false})
    this.getData();
    this.getData1();
    //日历相关
    const today_date = new Date();

    const today_month = new Date(
      today_date.getFullYear(),
      today_date.getMonth(),
      1
    );
    const next_month = new Date(
      today_date.getFullYear(),
      today_date.getMonth() + 1,
      1
    );
    var validDateNum = 0;
    var that = this;

    const year_value =
      today_date.getFullYear() == new Date().getFullYear()
        ? ""
        : today_date.getFullYear() + "年";
    
    this.setData({
      date_now: {
        month: today_date.getMonth() + 1,
        year: today_date.getFullYear(),
        value: year_value + (parseInt(today_date.getMonth()) + 1) + "月",
        choose: ""
      },
      date_next: {
        month: today_date.getMonth() + 2,
        year: today_date.getFullYear(),
        value: year_value + (parseInt(today_date.getMonth()) + 2) + "月",
        choose: ""
      }
    });
    
  },

  onReady: function() {
    var that = this;
    this.getTopDateList()
    // this.getTopDate();
    // this.reloadData();
  },
  //会议室列表详情
  getMeetDetail() {
    wx.reportAnalytics("goodsdetails");
    let meetingRoomId = this.data.meetingRoomId;
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krmting/room/detail",
      method: "GET",
      data: {
        meetingRoomId: meetingRoomId
      },
      success: res => {
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;
          that.setData({
            meetingDetail: meetingDetail
          });
        } else {
          that.setData({
            phoneError: false,
            errorMessage: res.data.message
          });
          setTimeout(function() {
            that.setData({
              phoneError: true,
              errorMessage: ""
            });
          }, 2000);
        }
        wx.hideLoading();
      },
      fail: res => {
        that.setData({
          phoneError: false,
          errorMessage: res.message
        });
        setTimeout(function() {
          that.setData({
            phoneError: true,
            errorMessage: ""
          });
        }, 2000);
      }
    });
  },
  //散座详情列表
  getMeetDetail1() {
    wx.reportAnalytics("goodsdetails");
    let meetingRoomId = this.data.meetingRoomId1;
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krseat/seat/goods/detail",
      method: "GET",
      data: {
        seatGoodsId: meetingRoomId
      },
      success: res => {
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;
          that.setData({
            meetingDetail: meetingDetail
          });
        } else {
          that.setData({
            phoneError: false,
            errorMessage: res.data.message
          });
          setTimeout(function() {
            that.setData({
              phoneError: true,
              errorMessage: ""
            });
          }, 2000);
        }
        wx.hideLoading();
      },
      fail: res => {
        that.setData({
          phoneError: false,
          errorMessage: res.message
        });
        setTimeout(function() {
          that.setData({
            phoneError: true,
            errorMessage: ""
          });
        }, 2000);
      }
    });
  },
  //会议室立即约定
  nowReserve(e) {
    let that = this;
    let meetingRoomId = e.currentTarget.dataset.mid;
    let meetingDetail;
    if (this.button_boolean) {
      this.button_boolean = false;
      wx.getStorage({
        key: "orderDate",
        success: function(res) {
          if (res.data) {
            meetingDetail = Object.assign({}, that.data.meetDetail, res.data, {
              meetingRoomId: meetingRoomId
            });
            that.setDetail(meetingDetail);
          }
        }
      });
    }
  },
  //散座立即约定
  nowReserve1(e) {
    let that = this;
    let meetingRoomId1 = e.currentTarget.dataset.mid;
    let meetingDetail;
    if (this.button_boolean1) {
      this.button_boolean1 = false;
      wx.getStorage({
        key: "orderDate",
        success: function(res) {
          if (res.data) {
            meetingDetail = Object.assign({}, that.data.meetDetail, res.data, {
              meetingRoomId1: meetingRoomId1
            });
            that.setDetail1(meetingDetail);
          }
        }
      });
    }
  },
  preventTouchMove() {},

  //会议室跳转日历
  setDetail(arr) {
    let that = this;
    wx.setStorage({
      key: "meet_detail",
      data: arr,
      success: function() {
        that.button_boolean = true;
        setTimeout(function() {
          wx.redirectTo({
            url: "/pages/orderConfirmation/orderConfirmation?from=list"
          });
        }, 500);
      }
    });
  },
  //散座跳转日历
  setDetail1(arr) {
    let that = this;
    wx.setStorage({
      key: "detail-c",
      data: arr,
      success: function() {
        that.button_boolean1 = true;
        setTimeout(function() {
          wx.navigateTo({
            url: "/pages/seatorderConfirmation/seatorderConfirmation?seatId=" +arr.seatId+'&show_true='+false
          });
        }, 500);
      }
    });
  },
  dealMonth(timestamp){
    let today_month = new Date().getMonth() + 1;
    let month = new Date(timestamp).getMonth() + 1;
    if(today_month == month){
      return 'date_data1'
    }else{
      return 'date_data2'
    }
  },
  getTopDateList(){
    let that = this;
    //处理今天和明天的日期
    var today = new Date();
    var tomorrow = new Date().setDate(today.getDate() + 1);
    tomorrow = new Date(tomorrow);
    var month = today.getMonth() + 1;
    month = month>9?month:'0'+month;
    var t_month = tomorrow.getMonth() + 1;
    t_month = t_month>9?t_month:'0'+t_month;
    var day = today.getDate()>9?today.getDate():'0'+today.getDate();
    var t_day = tomorrow.getDate()>9?tomorrow.getDate():'0'+tomorrow.getDate();
    today = today.getFullYear()+'-'+month+'-'+day;
    tomorrow = tomorrow.getFullYear()+'-'+t_month+'-'+t_day;
    // 结束
    app.getRequest({
      url:app.globalData.KrUrl+"api/gateway/km/mobile/community/get-workday",
      methods:"GET",
      data:{
       cmtId:this.data.communityId,
       span:30,
      },
      success:res=>{
        let list = res.data.data;
        let dataList = list.map(item=>{
          let obj = {};
          let time  = new Date(item)
          obj.date = item;
          obj.bool = false;
          obj.actived = false;
          obj.times = new Date(item).getTime();
          let week = time.getDay()
          obj.type = that.dealMonth(item)

          if(today === item){
            obj.week = '今天';
            obj.actived = true;
          }else if(tomorrow === item){
            obj.week = '明天';
          }else{
            obj.week = that.getWeek(week);
          }
          obj.day = time.getDate();
          return obj
        })
        var orderDate = {
          time: dataList[0].date,
          timeText: dataList[0].week
        };
        this.setData(
          {
            topDate: dataList,
            nowDate: dataList[0].date,
            allDays: dataList,
            nowDateIndex: 0
          },
          function() {
            that.getData();
            that.getData1();
            that.dealDateList();
            wx.setStorageSync("nowDate", dataList[0].date);
            wx.setStorageSync("orderDate", orderDate);
            wx.setStorageSync("topDate", dataList);
            wx.setStorageSync("nowDateIndex", 0);
          }
        );
       
      }
    })
  },
  dealDateList:function(){
    let init_date = this.data.nowDate;
    let topDate = this.data.topDate;
    let that = this;
    console.log('dealDateList==',init_date)
    const today_date = new Date(init_date);
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1);
    let init_month = today_month.getTime()
        that.james = new dateData({
          btn_bool:true,
          data: topDate,
          init_data: {
            last_btn_num: init_date, //日期
            last_data: that.last_data,
          },
        });
        this.setData({
          date_data1: that.james.date_data1,
          date_data2: that.james.date_data2,
        }); 
  },
});
