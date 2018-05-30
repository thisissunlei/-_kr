//orderConfirmation.js
//获取应用实例
const app = getApp()
var newDate=changeTime(1396310706000);
var theme=newDate[1]+''+newDate[2]+'会议';
let arr=[20,21,22,23,24,25];
Page({
  data: {
    theme:theme,
    remind:'提前15分钟',
    phone:'13333333332',
    check:false,
    capacity:'10人',
    roomName:'水星会议室1',
    imgUrl:'',
    promotionCost:'48',
    unitCost:'60',
    hour:getHour(arr),
    beginTime:getTime('20'),
    endTime:getTime('25'),
    dialogShow:false,
    typeStatus:true,
    message:'用户取消支付',
    messageShow:false,
    dialogTimeShow:true,
    rangeTime1:[],
    rangeTime2:[],
    rangeTime3:[],
    rangeTime:[],
    selectedTime:[],
  },
  changeCheckbox:function(){
    this.setData({
        check:!this.data.check
    })
  },
  jumpSetTheme:function() {
    wx.navigateTo({
      url: '../meetingTheme/meetingTheme?value='+this.data.theme
    })
  },
  jumpSetRemind:function() {
    wx.navigateTo({
      url: '../warn/warn?value='+this.data.remind
    })
  },
  jumpSetPhone:function() {
    wx.navigateTo({
      url: '../phone/phone?value='+this.data.phone
    })
  },
  getBoardroomTime:function(){
    
  },
  tapTime:function(e){
    var indexParam = e.currentTarget.dataset.index;
    // var selectedTime = this.data.selectedTime;
    var selectedTime = [];
    var rangeTime = this.data.rangeTime.map((item,index)=>{
      //1 判断长度  2 排序  3最小到最大判断  4变色  5 push
      if(!item.disabled && item.number==indexParam){
        item.actived = !item.actived; 
      }
      if(item.actived){
        selectedTime.push(item.number);
      }else{
        if(selectedTime.indexOf(item.number)>-1){
          selectedTime.splice(selectedTime.indexOf(item.number), 1);
        }
      }
      return item;
    })
    console.log(selectedTime);
    this.setData({
      rangeTime1:rangeTime.slice(0,8),
      rangeTime2:rangeTime.slice(8,16),
      rangeTime3:rangeTime.slice(16),
      rangeTime:rangeTime,
      selectedTime:selectedTime,
      
    })
    
  },
  onLoad: function (options) {
    // var rangeTime = wx.getStorageSync('rangeTime');
    var rangeTime = wx.getStorageSync('rangeTime').map((item,index)=>{
      // if (index==indexParam) {
        // item.actived = true; 
      // }else{
        item.actived = false; 
      // }
      return item;
    })
    console.log(rangeTime);
    this.setData({
      rangeTime1:rangeTime.slice(0,8),
      rangeTime2:rangeTime.slice(8,16),
      rangeTime3:rangeTime.slice(16),
      rangeTime:rangeTime,
    })
  },
  
})

function getTime(time){
  var timeObj={
    '19':'9:00',
    '20':'9:30',
    '21':'10:00',
    '22':'10:30',
    '23':'11:00',
    '24':'11:30',
    '25':'12:00',
    '26':'12:30',
    '27':'13:00',
    '28':'13:30',
    '29':'14:00',
    '30':'14:30',
    '31':'15:00',
    '32':'15:30',
    '33':'16:00',
    '34':'16:30',
    '35':'17:00',
    '36':'17:30',
    '37':'18:00',
    '38':'18:30',
    '39':'19:00'
  }
  return timeObj[time];
}

function getHour(data){
  var len=data.length-1;
  return len*0.5;
}

function changeTime(data){
  let  myDate = new Date(data)  || new Date();
   var myArray = Array();
   
  let year=myDate.getFullYear();
  let month =myDate.getMonth()+1;
  let day=myDate.getDate();
  let hour=myDate.getHours();
  let minutes=myDate.getMinutes();
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
    return myArray;

}