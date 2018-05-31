//orderConfirmation.js
//获取应用实例
const app = getApp()
var newDate=changeTime(1396310706000);
var theme=newDate[1]+''+newDate[2]+'会议';
let arr=[20,21,22,23,24,25];
Page({
  data: {
    themeName:theme,
    remind:'提前15分钟',
    phone:'13333333333',
    check:true,
    imgUrl:'',
    beginTime:getTime('20'),
    endTime:getTime('25'),
    dialogShow:false,
    typeStatus:true,
    message:'用户取消支付',
    messageShow:false,
    dialogTimeShow:false,
    rangeTime1:[],
    rangeTime2:[],
    rangeTime3:[],
    rangeTime:[],
    selectedTime:[],
    nowDate:'',
    meetDetailShow:false,
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum:1,
    timeText:'',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    meetInfo:['1','2','3',4,5,7,9,9,4,5,7,9,9],
    meetingRoomId:'',
    alertTime:'FIFTEEN',
    order_pay:{},
    priceCount:'0',
    totalCount:'0',
    detailInfo:{},
    orderDate:{},
    meeting_time:{
      time:'10:30-11:30',
      timeArr:[22,23,24],
      beginTime:'',
      endTime:'',
    },
    isFirst:true,
    errorMessage:'',
    checkMessage:false,
  },
 
  openMeetDetail:function(e){
    
    this.setData({
      meetingRoomId:'',
      meetDetailShow:!this.data.meetDetailShow
    })
  },
  closeMeetDetail:function(){
      this.setData({
        meetingRoomId:'',
        meetDetailShow:!this.data.meetDetailShow
      })
  },
  changeCheckbox:function(){
    this.setData({
        check:!this.data.check
    })
  },
  getRemind:function(alertTime){
    let themeObj={
      'NOALERT':'无',
      'FIVE':'提前5分钟',
      'FIFTEEN':'提前15分钟',
      'THIRTY':'提前30分钟'
    }
    this.setData({
      remind:themeObj[alertTime]
    })
  },
  jumpSetTheme:function() {
    this.setData({
      order_pay:{
        themeName:this.data.themeName,
        alertTime:this.data.alertTime,
        linkPhone:this.data.phone
      }
    })
    wx.setStorage({
      key:"order_pay",
      data:this.data.order_pay,
      success:function(){
        wx.navigateTo({
          url: '../meetingTheme/meetingTheme?type=storage'
        })
      }
    })
   
   
  },
  jumpSetRemind:function() {
    this.setData({
      order_pay:{
        themeName:this.data.themeName,
        alertTime:this.data.alertTime,
        linkPhone:this.data.phone
      }
    })
    wx.setStorage({
      key:"order_pay",
      data:this.data.order_pay,
      success:function(){
        wx.navigateTo({
          url: '../warn/warn?type=storage'
        })
      }
    })
  },
  jumpSetPhone:function() {
    this.setData({
      order_pay:{
        themeName:this.data.themeName,
        alertTime:this.data.alertTime,
        linkPhone:this.data.phone
      }
    })
    wx.setStorage({
      key:"order_pay",
      data:this.data.order_pay,
      success:function(){
        wx.navigateTo({
          url: '../phone/phone?type=storage'
        })
      }
    })
  },
  getBoardroomTime:function(){
    
  },
  tapTime:function(e){
    
    var indexParam = e.currentTarget.dataset.index;
    console.log(this.data.rangeTime);
    var test = [].concat(this.data.rangeTime);
    // console.log(this.data.selectedTime);
    // var selectedTime = this.data.selectedTime;
    var selectedTime = [];
    var rangeTime=[];
    // test.for((item,index)=>{
      
    //   //1 判断长度  2 排序  3最小到最大判断  4变色  5 push
    //   if(!item.disabled && item.number==indexParam){
    //     item.actived = !item.actived; 
    //   }
    //   if(item.actived){
    //     selectedTime.push(item.number);
    //   }
    //   return item;
    // })
    for(let i=0; i < test.length; i++){
      //重点
      var item=Object.assign({},test[i]);
      if(!item.disabled && item.number==indexParam){
        item.actived = !item.actived; 
      }
      if(item.actived){
        selectedTime.push(item.number);
      }
      rangeTime.push(item);
    }
    var bool = true;
    if(selectedTime.length>1){
        for (let i = 0; i < selectedTime.length-1; i++) {
          var a = selectedTime[i+1]-selectedTime[i];
          if (Math.abs(a)!=1) {
            bool = false;
            break ;
          }
        }
    }
    var that = this;
    console.log("all",selectedTime);
    if(bool){
      console.log("true");
      this.setData({
        rangeTime1:[].concat(rangeTime.slice(0,8)),
        rangeTime2:[].concat(rangeTime.slice(8,16)),
        rangeTime3:[].concat(rangeTime.slice(16)),
        rangeTime:[].concat(rangeTime),
        selectedTime:[].concat(selectedTime),
        meeting_time:{
          time:getTime(selectedTime[0])+'-'+getTime(Number(selectedTime[selectedTime.length-1])+1),
          beginTime:getTime(selectedTime[0]),
          endTime:getTime(Number(selectedTime[selectedTime.length-1])+1),
          hours:getHour(selectedTime)
        }
      })
    }else{
      wx.showToast({
        title: '请选择连续时间段',
        icon: 'none',
        duration: 1000
      })
      return ;
    }
    console.log("实际",this.data.selectedTime);
    console.log(this.data.meeting_time);
    
  },
  stopPropagation:function(){
    return ;
  },
  subTime:function(e){
    if(this.data.selectedTime.length>0){
      wx.setStorageSync('meeting_time',this.data.meeting_time);
      this.closeDialogTime();
    }
    
  },
  onLoad: function (options) {
    // var rangeTime = wx.getStorageSync('rangeTime');
    this.goToPay();
    this.getIsfirst();
    let len=this.data.meeting_time.timeArr.length-1;
    let hour=(len*30)/60
    this.setData({
      order_pay:{
        themeName:this.data.themeName,
        alertTime:this.data.alertTime,
        linkPhone:this.data.phone
      },
      hour:hour
    })
    var _this=this;
    wx.getStorage({
      key:'detail',
      success:function(res){
        if(res.data){
          _this.setData({
              detailInfo:res.data
            })
        }
      }
    })
    wx.getStorage({
      key:'orderDate',
      success:function(res){
        if(res.data){
          _this.setData({
              orderDate:res.data,
            })
        }
      }
    })
    wx.getStorage({
      key:'meeting_time',
      success:function(res){
        if(res.data){
          _this.setData({
            meeting_time:res.data,
            })
        }
      }
    })
    
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
      nowDate:wx.getStorageSync('nowDate')
    })
    
    
  },
  getIsfirst:function(){
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/isFirstOrder',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          this.setData({
            isFirst:res.data.data.first
          })
        }
    })
  },
  closeDialogTime:function(){
    var that = this;
    this.setData({
      dialogTimeShow:!that.data.dialogTimeShow
    })
  },
  goToPay:function(){
    //let data=this.data;
    //var _this=this;
    // if(!data.check){
    //   this.setData({
    //     checkMessage:true,
    //     errorMessage:'请阅读并同意KrMeeing服务须知'
    //   })
    //   setTimeout(function(){
    //     _this.setData({
    //       checkMessage:false,
    //       errorMessage:''
    //     })
    //   },2000)
    //   return
    // }
    // if(!data.order_pay.linkPhone){
    //     this.setData({
    //       checkMessage:true,
    //       errorMessage:'请填写联系电话'
    //     })
    //     setTimeout(function(){
    //       _this.setData({
    //         checkMessage:false,
    //         errorMessage:''
    //       })
    //     },2000)
    //     return
    // }

    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/create',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        alertTime:'FIFTEEN',
        beginTime:'2018-04-21 10:30:00',
        endTime:'2018-04-21 12:30:00',
        linkPhone:'13323456789',
        meetingRoomId:'769',
        themeName:'0421会议'
      },
      success:(res)=>{
          console.log('res.data.data',res.data.data)
           
      }
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