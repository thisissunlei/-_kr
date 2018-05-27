//orderConfirmation.js
//获取应用实例
const app = getApp()
var newDate=changeTime();
var theme=newDate[1]+''+newDate[2]+'会议';

Page({
  data: {
    motto: 'Hello World',
    theme:theme,
  },
  //事件处理函数
  jumpSetTheme:function() {
      console.log('---->>>>',this.data)
    wx.navigateTo({
      url: '../meetingTheme/meetingTheme?value='+this.data.theme
    })
   
  },
  onLoad: function (options) {
   
  },
  
})

function changeTime(){
  let  myDate = new Date();
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