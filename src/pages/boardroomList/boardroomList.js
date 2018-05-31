//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    dialogDate:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    boardroomList:[{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'06F',meetingRoomId:1,device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',promotionCost:'22',disableTime:['21','24','25','26','27','30','37','38','39','40']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['1','12','13','14','15']},{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',disableTime:['4','11','16','19','20']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['21','32','23','14','15']}],
    topDate:[],
    page:1,
    nextPage:2,
    pageSize:10,
    totalPages:1,
    communityId:'1',
    dateScrollLeft:0,
    nowDate:'',
    meetDetailShow:false,
    meetingRoomId:'',
    rangeTime:[{
      disabled:false,
      number:'19'
    },
    {
      disabled:false,
      number:'20'
    },
    {
      disabled:false,
      number:'21'
    },
    {
      disabled:false,
      number:'22'
    },
    {
      disabled:false,
      number:'23'
    },
    {
      disabled:false,
      number:'24'
    },
    {
      disabled:false,
      number:'25'
    },
    {
      disabled:false,
      number:'26'
    },
    {
      disabled:false,
      number:'27'
    },
    {
      disabled:false,
      number:'28'
    },
    {
      disabled:false,
      number:'29'
    },
    {
      disabled:false,
      number:'30'
    },
    {
      disabled:false,
      number:'31'
    },
    {
      disabled:false,
      number:'32'
    },
    {
      disabled:false,
      number:'33'
    },
    {
      disabled:false,
      number:'34'
    },
    {
      disabled:false,
      number:'35'
    },
    {
      disabled:false,
      number:'36'
    },
    {
      disabled:false,
      number:'37'
    },
    {
      disabled:false,
      number:'38'
    }
  ],
    communityList:[{
      id: 22,
      name: '美国'
    },
    {
      id: 86,
      name: '中国'
    },
    {
      id: 33,
      name: '巴西'
    },
    {
      id: 44,
      name: '日本'
    }],
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
    }
  },
  
  openMeetDetail:function(e){
    let that = this;
    let id=e.currentTarget.dataset.item.meetingRoomId;
    this.setData({
      meetingRoomId:id,
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
  currentChange:function(e){
    if(e.detail.source=="touch"){
      this.setData({
        currentNum:e.detail.current+1
      })
    }
  },
  scrollTopDate:function(validIndex){
    // console.log(validIndex);
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
    var orderDate = {
      time:topDate[validIndex].date,
      timeText:topDate[validIndex].week
    }
    this.setData({
      topDate:newData,
      dateScrollLeft:validIndex*53
    },function(){
      that.getData();
      wx.setStorageSync('orderDate',orderDate);
    })
  },
  //获取会议室列表
  getData:function(){
    let that = this;
    
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
            boardroomList:res.data.data.items
          },function(){
            that.reloadData();
          })
        }
      })
  },


  //切换日期后重载数据
  reloadData:function(){
    var boardroomList = this.data.boardroomList;
    boardroomList.forEach((item,index) => {
      var rangeTime = [];
      for (let i = 19; i < 39; i++) {
        var rangeTimeItem = {
          disabled:false,
          number: `${i}`
        };
        rangeTime.push(rangeTimeItem);
      }
      item.rangeTime = rangeTime;
      item.rangeTime.forEach((timeItem,timeIndex) => {
          if(item.disableTime.indexOf(timeItem.number)>-1){
              timeItem.disabled = true;
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
        date:`${year}-${month}-${day}`
      };
      if(i==0){
        dateItem.actived = true;
      }
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
      }
      
    }
    // var _this = this;
    this.setData({
      topDate:topDate,
      nowDate:topDate[0].date,
    },function(){
      that.getData();
      wx.setStorageSync('nowDate',topDate[0].date);
    })
  },
  selectTopDate:function(e){
    var topDate = this.data.topDate;
    var indexParam = e.currentTarget.dataset.index;
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
    var orderDate = {
      time:date,
      timeText:week
    }
    this.setData({
      topDate:newData,
      nowDate:date,
    },function(){
      that.getData();
      wx.setStorageSync('nowDate',date);
      wx.setStorageSync('orderDate',orderDate);
    })
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

      // this.$http.get('get-news-list',{page,pageSize}).then(function(response){

      //   var totalPages = response.data.totalPages;

      //   that.items = [].concat(that.data.boardroomList,response.data.items);

            //   that.setData({
//            nextPage:nextPage++
      // }) 

      //   that.setData({
//            totalPages:totalPages
      // }) 

      // });

      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/list',
        methods:"GET",
        data: {
          communityId: that.data.communityId ,
          date: that.data.nowDate,
          page:that.data.page,
          pageSize:that.data.pageSize
        },
        success:(res)=>{
          that.setData({
              boardroomList:[].concat(that.data.boardroomList,res.data.data.items),
              nextPage:that.data.nextPage++
          })
        }
      })
  },
  //事件处理函数

  changeCommunity: function(e) {
    var communityList = this.data.communityList;
    var index = e.detail.value;
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
    })
  },

  toBottom: function(e) {
    this.loadNext();
  },

  // 日历相关
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  dateBtn :function(e){
    
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
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
      this.setData({
        nowDate:`${timeData.year}-${timeData.month}-${timeData.value}`,
      },function(){
        wx.setStorageSync('nowDate',that.data.nowDate);
        that.closeDialogDate();
      })


    }
  },
  closeDialogDate:function(){
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
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              type:'next'
            });
          }
          
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              type:'before'
            });
          }else{
            data.push({
              value:'今天',
              type:'now'
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              type:'before'
            });
          }else{
            data.push({
              value:'明天',
              type:'now'
            });
          }
          
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              type:'next'
            });
          }
  
          break;
        default:
          data.push({
            value:i-week+1,
            type:'before'
          });
          //this.all_day_num++;
        }
      }
    return data;
    
  },

  onLoad:function(options){
    if(options.communityId){
      this.setData({
        communityId:options.communityId
      })
    } 


    //日历相关
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    var date1 = this.dealDate(today_month,true);
    var date2 = this.dealDate(next_month,false); 
    // var date = date1.concat(date2);
    // var allDate=[];
    var validDateNum = 0;
    date1 = date1.map((item,index)=>{
      if(item.value && item.type!='before') {
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

    this.setData({
      date_data1:date1,
      date_data2:date2,
      date_now:{
        month:today_date.getMonth()+1,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月',
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月',
        choose:''
      }
    });

  },

  onReady: function () {
    var that = this;
    this.getTopDate();
    // this.reloadData();
  },
  getMeetDetail(){
    let meetingRoomId = this.data.meetingRoomId;
    let that = this;
    // that.setData({
    //   meetingDetail:that.data.detail
    // })
    // return;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/detail',
        method:"GET",
        data:{
          "meetingRoomId":meetingRoomId
        },
        success:(res)=>{
          console.log('success',res)
          if(res.data.code>0){
            let meetingDetail = res.data.data;
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
          console.log('=======>',that.data.meetingDetail)
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


