//index.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function() {
    return {
      title: 'KrMeeting会议室，让会议更轻松、更简单',
      desc: 'KrMeeting会议室',
      path: "pages/index/index",
      imageUrl : '../images/share_pic.jpg'
    };
  },
  data: {
    //数据模拟
    arr:[],
    sanzuo:false,
    ifFixed:false,
    meeting_detail:{},
    dialogDate:false,
    hasUserInfo: false,
    boardroomList:[],
    topDate:[],
    page:1,
    nextPage:2,
    pageSize:10,
    totalPages:1,
    communityId:'1',
    dateScrollLeft:0,
    nowDate:'',
    meetDetailShow:false,
    meetDetailShow1:false,
    meetingRoomId:'',
    meetingRoomId1:'',
    meetDetail:{},
    allDays:[],
    isToday:false,
    nowDateIndex:0,
    communityList:[],
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum:1,
    number:10,
    meetInfo:['1','2','3',4,5,7,9,9,4,5,7,9,9],
    splice:"666",
    goodsid:'',
    seatid:"",
    // 日历相关
    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    meetingDetail:{},
    detail:{
      address:'社区地址',//社区地址
      buildName:'大厦名称',//大厦名称
      capacity:'容纳人数',//容纳人数
      device:[
        {
          icon:'',
          name:'沙发'
        }
      ],//设备列表
      floor:'楼层',//楼层
      meetingRoomName:'会议室名称',//会议室名称
      promotionCost:'促销单价',//促销单价
      promotionDescr:'促销描述',  //促销描述
      roomImg:[
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      ],//会议室图片
      unitCost:'销售单价'// 销售单价(元
    },
   
  },
  index_x:'',
  button_boolean:true,
  button_boolean1:true,
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
  //预定跳转页面
  list(e){
    let rangeTime = e.currentTarget.dataset.rangetime;
    let detail = e.currentTarget.dataset.detail;
    let id=111
    console.log(e)
    wx.setStorageSync('rangeTime-c',rangeTime);
    wx.setStorageSync('detail-c',detail);
    wx.navigateTo({
      url: '/pages/seatorderConfirmation/seatorderConfirmation?id='+e.currentTarget.dataset.detail.goodsId
    })
  },
  //散座
  openMeetDetail1:function(e){
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let id=e.currentTarget.dataset.item.id;
    let detail=e.currentTarget.dataset.item;
    this.setData({
      meetingRoomId1:id,
      meetDetailShow1:!this.data.meetDetailShow1,
      meetDetail:detail
    },function(){
      that.getMeetDetail1()
    })
  },
  //会议
  openMeetDetail:function(e){
    // console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let id=e.currentTarget.dataset.item.meetingRoomId;
    let detail=e.currentTarget.dataset.item;
    this.setData({
      meetingRoomId:id,
      meetDetailShow:!this.data.meetDetailShow,
      meetDetail:detail
    },function(){
      that.getMeetDetail()
    })
  },
  //会议室门板
  closeMeetDetail:function(){
      this.setData({
        meetingRoomId:'',
        meetDetailShow:!this.data.meetDetailShow
      })
  },
  //散座门板
  closeMeetDetail1:function(){
    this.setData({
      meetingRoomId1:'',
      meetDetailShow1:!this.data.meetDetailShow1
    })
},
  currentChange:function(e){
    if(e.detail.source=="touch"){
      this.setData({
        currentNum:e.detail.current+1
      })
    }
  },
  scrollTopDate:function(validIndex){
    var topDate = this.data.topDate;
    var indexParam = validIndex;
    var that = this;
    // console.log(topDate);
    var newData = topDate.map((item,index)=>{
      if (index==indexParam) {
        item.actived = true; 
      }else{
        item.actived = false; 
      }
      return item;
    })
    if(validIndex==0 && topDate[0].week=="今天"){
      this.setData({
        isToday:true
      })
    }else{
      this.setData({
        isToday:false
      })
    }
    var orderDate = {
      time:topDate[validIndex].date,
      timeText:topDate[validIndex].week
    }
    this.setData({
      topDate:newData,
      dateScrollLeft:validIndex*53,
      nowDate:topDate[validIndex].date,
      nowDateIndex:validIndex
    },function(){
      that.getData();
      that.getData1();
      wx.setStorageSync('nowDate',topDate[validIndex].date);
      wx.setStorageSync('orderDate',orderDate);
      wx.setStorageSync('nowDateIndex',validIndex);
    })
  },
  //获取会议室列表
  getData:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let arr = []
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/list',
        methods:"GET",
        data: {
          communityId: that.data.communityId,
          date: that.data.nowDate,
          page:that.data.page,
          pageSize:that.data.pageSize
        },
        
        success:(res)=>{
          
          that.setData({
            totalPages:res.data.data.totalPages,
            boardroomList:res.data.data.items,
            page:1,
            nextPage:2,
          },function(){
            that.reloadData();
            wx.hideLoading();
          })
          this.data.boardroomList.forEach(element=>{
            wx.setNavigationBarTitle({
              title:element.buildName
            })
          })
        }
      })
     
  },
  //获取散座列表
  getData1:function(){
    let that =this
    // console.log(that.data.communityId,that.data.nowDate)
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/cmt',
        methods:"GET",
        data: {
          communityId: that.data.communityId,
          dateTime: that.data.nowDate,
        },
        success:(res)=>{
          this.setData({
            goodsid:res.data.data.goodsId,
            seatid:res.data.data.seatId
          })
          var b = (JSON.stringify(res.data.data) == "{}")
          if(res.data.code == 1 && b == true){
            this.setData({
              sanzuo:false
            })
          }else{
            let arr_null = [] 
            // console.log(res)
            arr_null.push(res.data.data)
            that.setData({
              arr:arr_null,
              sanzuo:true
            },function(){
              that.reloadData();
              wx.hideLoading();
            })
          }
        }
      })
  },
  //切换日期后重载数据
  reloadData:function(){
    var boardroomList = this.data.boardroomList;
    
    //过滤已过去的时间
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let limitTime = 2*hours+1+(minutes>29?1:0);
    var that = this;
    boardroomList.forEach((item,index) => {
      var rangeTime = [];
      for (let i = 19; i < 39; i++) {
        var rangeTimeItem = {
          disabled:false,
          number: i
        };
        rangeTime.push(rangeTimeItem);
      }
      item.rangeTime = rangeTime;
      item.rangeTime.forEach((timeItem,timeIndex) => {
          if(item.disableTime.indexOf(timeItem.number)>-1){//过滤已过去的时间
              timeItem.disabled = true;
          }
          if(that.data.isToday){
            if(timeItem.number<limitTime){
              timeItem.disabled = true;
            }
          }
      });
    });
    this.setData({
      boardroomList:boardroomList
    })
  },
 getMonthDays:function(year,month){
    //判断2月份天数
    var days;
    if(month==2){
      days= (year%4==0)&&(year%100!=0)||(year%400==0)? 29:28;
    }else {
      //1-7月 单数月为31日 
      if(month<7){
        days= month%2==1?31:30;
      }else {
      //8-12月 双月为31日
        days = month%2==0?31:30;
      }
    }
    return days; 
  },
  getWeek:function(weekParam){
    var week;
    switch (weekParam%7) {
      case 0:
        week = '周日';
        break;
      case 1:
        week = '周一';
        break;
      case 2:
        week = '周二';
        break;
      case 3:
        week = '周三';
        break;
      case 4:
        week = '周四';
        break;
      case 5:
        week = '周五';
        break;
      case 6:
        week = '周六';
        break;                        
           
      default:
        break;
    }
    return week;
  },
  getDay(dayParam,totalDay){
    if((totalDay%dayParam==totalDay)&&(totalDay!=dayParam)){
        return dayParam%totalDay;
    }else{
      return dayParam;
    }
  },
  getTopDate:function(){
    var topDate = [];
    var that = this;
    for(let i=0;i<30;i++){
      var today = new Date();
      today.setDate(today.getDate()+i);
      var year=today.getFullYear();
      var month = today.getMonth()+1;
      var day = today.getDate();
      var totalDay=this.getMonthDays(year,month);
      var todayWeek = today.getDay();
      var dateItem = {
        week:'',
        day:'',
        actived:false,
        bool:true,
        date:`${year}-${month<10?('0'+month):month}-${day<10?('0'+day):day}`
      };
      if(i<2){
        dateItem.week = (i==0?'今天':'明天');
      }else{
        dateItem.week = this.getWeek(todayWeek);
      }
      dateItem.day = this.getDay(day,totalDay);
      if((todayWeek)%7==0||(todayWeek)%7==6){
        dateItem.class_bool = 'btn_no';
        dateItem.bool = 'false';
      }else{
        topDate.push(dateItem);
        topDate[0].actived = true;
      }
      
    }
    if(topDate[0].week=="今天"){
      this.setData({
        isToday:true
      })
    }else{
      this.setData({
        isToday:false
      })
    }
    // var _this = this;
    var orderDate = {
      time:topDate[0].date,
      timeText:topDate[0].week
    }
    this.setData({
      topDate:topDate,
      nowDate:topDate[0].date,
      allDays:topDate,
      nowDateIndex:0,
    },function(){
      that.getData();
      that.getData1();
      wx.setStorageSync('nowDate',topDate[0].date);
      wx.setStorageSync('orderDate',orderDate);
      wx.setStorageSync('topDate',topDate);
      wx.setStorageSync('nowDateIndex',0);
    })
  },
  selectTopDate:function(e){
    // console.log(e)
    var topDate = this.data.topDate;//[]
    var indexParam = e.currentTarget.dataset.index;
    this.changeTimeColor(indexParam);
    var date = e.currentTarget.dataset.date;
    var week = e.currentTarget.dataset.week;
    var that = this;
    var newData = topDate.map((item,index)=>{
      if (index==indexParam) {
        item.actived = true; 
      }else{
        item.actived = false; 
      }
      return item;
    })
    if(indexParam==0 && topDate[0].week=="今天"){
      this.setData({
        isToday:true
      })
    }else{
      this.setData({
        isToday:false
      })
    }
    var orderDate = {
      time:date,
      timeText:week
    }
    this.setData({
      topDate:newData,
      nowDate:date,
      nowDateIndex:indexParam
    },function(){
      that.getData();
      that.getData1();
      wx.setStorageSync('nowDate',date);
      wx.setStorageSync('orderDate',orderDate);
      wx.setStorageSync('nowDateIndex',indexParam);
    })
  },

  changeTimeColor:function(param){
    var a = false;
    var dateType = '';
    var dateIndex = '';
    this.data.date_data1.forEach((item,index) => {
      if(item.validDateNum==param){
        
        dateIndex = index;
        a = true;
        dateType='1';
      }
    });
    // last_btn_num
    if(!a){
      this.data.date_data2.forEach((item,index) => {
        // console.log(item);
        if(item.validDateNum==param){
          
          dateIndex = index;
          a = true;
          dateType='2';
        }
      });
    }
    var newDate1 = this.data.date_data1;
    var newDate2 = this.data.date_data2;
    if(this.last_data=='date_data1'){
      newDate1[this.last_btn_num]['type'] = newDate1[this.last_btn_num]['type'].replace('active ','');
      this.setData({
        date_data1:newDate1
      });
    }else if(this.last_data=='date_data2'){
      newDate2[this.last_btn_num]['type'] = newDate2[this.last_btn_num]['type'].replace('active ','');
      this.setData({
        date_data2:newDate2
      });
    }
    if(dateType=='2'){
      this.last_btn_num = dateIndex;
      this.last_data = 'date_data2';
      newDate2[parseInt(dateIndex)]['type'] = 'active ' + newDate2[parseInt(dateIndex)]['type'];
      this.setData({
        date_data2:newDate2
      });
    }else{
      this.last_btn_num = dateIndex;
      this.last_data = 'date_data1';
      newDate1[parseInt(dateIndex)]['type'] = 'active ' + newDate1[parseInt(dateIndex)]['type'];
      this.setData({
        date_data1:newDate1
      });
    }
    // console.log(dateType[parseInt(dateIndex)]);
    // dateType[parseInt(dateIndex)]['type'] = 'active ' + dateType[parseInt(dateIndex)]['type'];
  },

  //加载下一页会议室列表数据
  loadNext: function() {
    
    var communityList = this.data.communityList;
    var page = this.data.nextPage;
    var pageSize = this.data.pageSize;
    var totalPages = this.data.totalPages;
    if(page>totalPages){
      return ;
    }
      var that = this;
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/list',
        methods:"GET",
        data: {
          communityId: that.data.communityId ,
          date: that.data.nowDate,
          page:page,
          pageSize:that.data.pageSize
        },
        success:(res)=>{
          that.setData({
              boardroomList:[].concat(that.data.boardroomList,res.data.data.items),
              nextPage:that.data.nextPage+1
          },function(){
            that.reloadData();
          })
        }
      })
  },
  //事件处理函数

  changeCommunity: function(e) {
    var communityList = this.data.communityList;
    var index = e.detail.value;
    // console.log(communityList[index].name)
    wx.setNavigationBarTitle({
      title: communityList[index].name
    })
  },

  reserve:function(e) {
    var rangeTime = e.currentTarget.dataset.rangetime;
    var detail = e.currentTarget.dataset.detail;
    wx.setStorageSync('rangeTime',rangeTime);
    wx.setStorageSync('detail',detail);
    wx.navigateTo({
      url: '/pages/orderConfirmation/orderConfirmation'
      // url: '/pages/seatorderConfirmation/seatorderConfirmation'
    })
  },

  toBottom: function(e) {
    this.loadNext();
  },

  // 日历相关
  all_day_num:0,
  last_btn_num:'false',
  last_data:'date_data1',
  dateBtn :function(e){
    // console.log(e)
    //亮的或者今天  明天
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      // console.log(e);
      const new_data = this.data[e.target.dataset.data];
      var old_data = [];
      if(this.last_data!='false'){
        if(this.last_data=='date_data1'){
          old_data = this.data['date_data1'];
          old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
          this.setData({
            date_data1:old_data
          });
        }else if(this.last_data=='date_data2'){
          old_data = this.data['date_data2'];
          old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
          this.setData({            
            date_data2:old_data
          });
        }
      }     
      new_data[parseInt(e.target.dataset.num)]['type'] = 'active ' + new_data[parseInt(e.target.dataset.num)]['type'];
      if(e.target.dataset.data=='date_data2'){
        this.setData({
          date_data2:new_data,         
        });
      }else if(e.target.dataset.data=='date_data1'){
        this.setData({
          date_data1:new_data,        
        });
      }
      this.last_btn_num = e.target.dataset.num;
      this.last_data = e.target.dataset.data; 
      var timeData =   e.target.dataset;
      var that = this;
      this.scrollTopDate(timeData.validIndex);
      // this.setData({
      //   nowDate:`${timeData.year}-${timeData.month+1}-${timeData.day}`,
      // },function(){
      //   wx.setStorageSync('nowDate',that.data.nowDate);
        that.closeDialogDate();
      // })


    }
  },
  closeDialogDate:function(){
    //未知，待定
    // wx.reportAnalytics('click')
    let that = this;
    that.setData({
      dialogDate:!that.data.dialogDate
    })
  },
  dealDate:function(today_month,bool){
    const week = today_month.getDay();
    const today = parseInt(new Date().getDate());
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;
    const data = [];
    for (var i = 0; i < day_num; i++) {
      switch (true){
        case i<week:
          data.push({
            value:''
          });
          break;
        case i>(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              day:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              day:i-week+1,
              type:'next'
            });
          }
          
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              day:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:'今天',
              day:i-week+1,
              type:'now'
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              day:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:'明天',
              day:i-week+1,
              type:'now'
            });
          }
          
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              day:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              day:i-week+1,
              type:'next'
            });
          }
  
          break;
        default:
          data.push({
            value:i-week+1,
            day:i-week+1,
            type:'before'
          });
          //this.all_day_num++;
        }
      }
    return data;
    
  },

  onLoad:function(options){
    // console.log(options)
    wx.reportAnalytics('community')
    if(options.communityId){
      this.setData({
        communityId:options.communityId
      })
    } 

    this.getData()
    this.getData1()
    //日历相关
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    
    var date1 = this.dealDate(today_month,true);
    var date2 = this.dealDate(next_month,false); 
    // var date = date1.concat(date2);
    // var allDate=[];
    var validDateNum = 0;
    var that = this;
    
    date1 = date1.map((item,index)=>{
      if(item.value && item.type!='before') {
        // 加颜色
        if(validDateNum==0){
          date1[index]['type'] = 'active ' + date1[index]['type'];

          // console.log("item",item,index);
          that.last_btn_num = index;
        }
        item.validDateNum = validDateNum++;
        
      }
      return item;
    })
    date2 = date2.map((item,index)=>{
      if(item.value && item.type!='before') {
        item.validDateNum = validDateNum++;
      }
      return item;
    })
    const year_value = today_date.getFullYear()==new Date().getFullYear() ? '' : today_date.getFullYear() + '年';
    // console.log(date1,date2);
    this.setData({
      date_data1:date1,
      date_data2:date2,
      date_now:{
        month:today_date.getMonth()+1,
        year:today_date.getFullYear(),
        value: year_value +(parseInt(today_date.getMonth())+1) + '月',
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:year_value +(parseInt(today_date.getMonth())+2) + '月',
        choose:''
      }
    });
    // console.log(1)

  },

  onReady: function () {
    var that = this;
    this.getTopDate();
    // this.reloadData();
  },
  //会议室列表详情
  getMeetDetail(){
    wx.reportAnalytics('goodsdetails')
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
            that.setData({
              meetingDetail:meetingDetail
            })
            console.log(this.data.meetingDetail)
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
          wx.hideLoading();
          
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
  //散座详情列表
  getMeetDetail1(){
    wx.reportAnalytics('goodsdetails')
    let meetingRoomId = this.data.meetingRoomId1;
    // console.log(meetingRoomId)
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/detail',
        method:"GET",
        data:{
          "seatGoodsId":this.data.goodsid
        },
        success:(res)=>{
          console.log(res)
          if(res.data.code>0){
            let meetingDetail = res.data.data;
            that.setData({
              meetingDetail:meetingDetail
            })
            console.log(this.data.meetingDetail)
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
          wx.hideLoading();
          
        },
        fail:(res)=>{
          // console.log('获取失败')
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
  //会议室立即约定
  nowReserve(e){
    let that = this;
    // console.log(e);
    let meetingRoomId = e.currentTarget.dataset.mid;
    let meetingDetail;
    if(this.button_boolean){
      this.button_boolean = false;
      wx.getStorage({
        key: 'orderDate',
        success: function(res) {
          if(res.data){
            meetingDetail = Object.assign({},that.data.meetDetail,res.data,{meetingRoomId:meetingRoomId});
           
            that.setDetail(meetingDetail)
          }
        }
      })
    }
  },
  //散座立即约定
  nowReserve1(e){
    let that = this;
    console.log(e);
    let meetingRoomId1 = e.currentTarget.dataset.mid;
    let meetingDetail;
    if(this.button_boolean1){
      this.button_boolean1 = false;
      wx.getStorage({
        key: 'orderDate',
        success: function(res) {
          if(res.data){
            meetingDetail = Object.assign({},that.data.meetDetail,res.data,{meetingRoomId1:meetingRoomId1});
           
            that.setDetail1(meetingDetail)
          }
        }
      })
    }
  },
  preventTouchMove(){},
    
  //会议室跳转日历
  setDetail(arr){
    let that = this;
    wx.setStorage({
        key:"meet_detail",
        data:arr,
        success:function(){
          that.button_boolean = true;
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/seatorderConfirmation/seatorderConfirmation?from=list'
            })
          },500)
          
        }
    })
  },
  //散座跳转日历
  setDetail1(arr){
    console.log(arr)
    let that = this;
    wx.setStorage({
        key:"meet_detail1",
        data:arr,
        success:function(){
          that.button_boolean1 = true;
          setTimeout(function(){
            wx.navigateTo({
              url: "/pages/meeting/meeting?id="+arr.id
            })
          },500)
          
        }
    })
  }
})


