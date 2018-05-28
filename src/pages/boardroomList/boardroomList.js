//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    boardroomList:[{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'06F',device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',disableTime:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['1','12','13','14','15']},{roomName:'A会议室',imgUrl:'../images/boardroomList/guding.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'白板'},{name:'电话会议'},{name:'视频投影'},{name:'洗衣机'},{name:'洗衣机'}],unitCost:'40',disableTime:['4','11','16','19','20']},{roomName:'B会议室',imgUrl:'../images/boardroomList/duli.png',capacity:'3',floor:'03F',device:[{name:'电视'},{name:'空调'},{name:'洗衣机'}],unitCost:'60',disableTime:['1','12','13','14','15']}],
    topDate:[],
    rangeTime:[{
      disabled:false,
      number:'1'
    },
    {
      disabled:false,
      number:'2'
    },
    {
      disabled:false,
      number:'3'
    },
    {
      disabled:false,
      number:'4'
    },
    {
      disabled:false,
      number:'5'
    },
    {
      disabled:false,
      number:'6'
    },
    {
      disabled:false,
      number:'7'
    },
    {
      disabled:false,
      number:'8'
    },
    {
      disabled:false,
      number:'9'
    },
    {
      disabled:false,
      number:'10'
    },
    {
      disabled:false,
      number:'11'
    },
    {
      disabled:false,
      number:'12'
    },
    {
      disabled:false,
      number:'13'
    },
    {
      disabled:false,
      number:'14'
    },
    {
      disabled:false,
      number:'15'
    },
    {
      disabled:false,
      number:'16'
    },
    {
      disabled:false,
      number:'17'
    },
    {
      disabled:false,
      number:'18'
    },
    {
      disabled:false,
      number:'19'
    },
    {
      disabled:false,
      number:'20'
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
  },

  //切换日期后重载数据
  reloadData:function(){
    var boardroomList = this.data.boardroomList;
    boardroomList.forEach((item,index) => {
      var rangeTime = [];
      for (let i = 0; i < 20; i++) {
        var rangeTimeItem = {
          disabled:false,
          number: `${1+i}`
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
        week = '日';
        break;
      case 1:
        week = '一';
        break;
      case 2:
        week = '二';
        break;
      case 3:
        week = '三';
        break;
      case 4:
        week = '四';
        break;
      case 5:
        week = '五';
        break;
      case 6:
        week = '六';
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
    for(let i=0;i<6;i++){
      var dateItem = {
        week:'',
        day:'',
        actived:false,
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
      topDate.push(dateItem);
    }
    // var _this = this;
    this.setData({
      topDate:topDate
    })
  },
  selectTopDate:function(e){
    var topDate = this.data.topDate;
    var indexParam = e.currentTarget.dataset.index;
    var newData = topDate.map((item,index)=>{
      if (index==indexParam) {
        item.actived = true; 
      }else{
        item.actived = false; 
      }
      return item;
    })
    this.setData({
      topDate:newData
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
    console.log(e);
  },


  onReady: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    this.getTopDate();
    this.reloadData();
  },
})
