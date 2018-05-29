//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    boardroomList:[{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'06F',device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',promotionCost:'22',disableTime:['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['1','12','13','14','15']},{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',disableTime:['4','11','16','19','20']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['21','32','23','14','15']}],
    topDate:[],
    page:1,
    nextPage:2,
    pageSize:10,
    totalPages:10,
    nowDate:'',
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
    indicatorDots: true,
    autoplay: false,
    duration: 1000,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },

  //获取会议室列表
  getData:function(){
    var that = this;
    wx.request({
        url:'api/gateway/krmting/room/list',
        data: {
          communityId: '' ,
          date: '2018-05-02'
        },
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
              console.log(res)
              that.setData({
                totalPages:res.data.totalPages,
                boardroomList:res.data.items
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
    console.log(this.data.boardroomList);
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
    var today = new Date();
    var year=today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var totalDay=this.getMonthDays(year,month+1);
    var todayWeek = today.getDay();
    var topDate = [];
    for(let i=0;i<30;i++){
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
        dateItem.week = this.getWeek(todayWeek+i);
      }
      dateItem.day = this.getDay(day+i,totalDay);
      if((todayWeek+i)%7==0||(todayWeek+i)%7==6){
        dateItem.class_bool = 'btn_no';
        dateItem.bool = 'false';
      }

      topDate.push(dateItem);
    }
    // var _this = this;
    this.setData({
      topDate:topDate,
      nowDate:topDate[0].date,
    })
  },
  selectTopDate:function(e){
    var topDate = this.data.topDate;
    var indexParam = e.currentTarget.dataset.index;
    var date = e.currentTarget.dataset.date;
    var newData = topDate.map((item,index)=>{
      if (index==indexParam) {
        item.actived = true; 
      }else{
        item.actived = false; 
      }
      return item;
    })
    
    this.setData({
      topDate:newData,
      nowDate:date
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

      wx.request({
        url:'api/gateway/krmting/room/list',
        data: {
          communityId: '' ,
          date: '2018-05-02'
        },
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
              console.log(res);
              that.setData({
                boardroomList:[].concat(that.data.boardroomList,response.data.items),
                totalPages:totalPages,
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


  toBottom: function(e) {
    this.loadNext();
  },

  onLoad:function(){
    //this.getData();
  },

  onReady: function () {
    var that = this;
    this.getTopDate();
    this.reloadData();
  },
})
