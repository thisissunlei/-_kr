//orderConfirmation.js
//获取应用实例
const app = getApp()


Page({
  data: {
    meetingDetail:{},
    themeName:'',
    remind:'提前15分钟',
    phone:'',
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
    meeting_time:{},
    isFirst:true,
    errorMessage:'',
    checkMessage:false,
  },
  onUnload:function(){
    let _this = this;
    wx.setStorage({
      key:"order_pay",
      data:{},
      success:function(){
          _this.setData({
            order_pay:{}
          })
      }
    })
    wx.setStorage({
      key:"meeting_time",
      data:{}
    })
    
  },
  closeDialog:function(){
    this.setData({
        dialogShow:!this.data.dialogShow
    })
  },
  openMeetDetail:function(e){
    let that = this;
    this.setData({
      meetingRoomId:'',
      meetDetailShow:!this.data.meetDetailShow
    },function(){
      that.getMeetId()
    })
  },
  getMeetId(){
    let that = this;
    wx.getStorage({
        key: 'detail',
        success: function(res) {
          if(res.data){
            that.setData({
              meetingRoomId:res.data.meetingRoomId
            },function(){
              that.getMeetDetail()
            })
          }
        }
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
     return themeObj[alertTime]
    
  },
  jumpSetTheme:function() {
    let data=this.data;
    wx.navigateTo({
      url: '../meetingTheme/meetingTheme?type=storage&themeName='+data.themeName
    })
   
   
  },
  jumpSetRemind:function() {
    let data=this.data;
    wx.navigateTo({
      url: '../warn/warn?type=storage&alertTime='+data.alertTime
    })
   
  },
  jumpSetPhone:function() {
    let data=this.data;
    wx.navigateTo({
      url: '../phone/phone?type=storage&linkPhone='+data.linkPhone
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
          beginTime:that.data.nowDate+' '+getTime(selectedTime[0])+':00',
          endTime:that.data.nowDate+' '+getTime(Number(selectedTime[selectedTime.length-1])+1)+':00',
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
      this.getPrice();
      this.closeDialogTime();
    }
    
  },
  getPrice:function(){
    let data=this.data;
    let price=data.detailInfo.promotionCost || data.detailInfo.unitCost;
    let unitCost=data.detailInfo.unitCost;
    let hours=data.meeting_time.hours;
    let priceCount=unitCost*hours*2;
    let totalCount=price*hours*2;
    
    this.setData({
      totalCount:totalCount,
      priceCount:priceCount
    })
  },
  onShow:function(){
    var _this=this;
    wx.getStorage({
      key:'order_pay',
      success:function(res){
        if(res.data){
          _this.setData({
              themeName:res.data.themeName || _this.data.themeName,
              remind:_this.getRemind(res.data.alertTime),
              linkPhone:res.data.linkPhone || '',
              order_pay:res.data
            })
        }
      }
    })
  },
  onLoad: function (options) {
    // var rangeTime = wx.getStorageSync('rangeTime');
    this.getIsfirst();
    
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
          let timeArr=res.data.time.split('-');
          let month=timeArr[1];
          let day=timeArr[2];
          if(month<10){
            month=`0${month}`
          }
          if(day<10){
            day=`0${day}`
          }
          let date=`${month}${day}`;
          
          let themeName=date+'会议';
          _this.setData({
              orderDate:res.data,
              themeName:themeName
          })
        }
      }
    })
    wx.getStorage({
      key:'meeting_time',
      success:function(res){
        if(res.data){
          _this.setData({
            meeting_time:res.data
          })
        }
      }
    })
   
    wx.getStorage({
      key:'order_pay',
      success:function(res){
        if(res.data){
          _this.setData({
              themeName:res.data.themeName || _this.data.themeName,
              remind:_this.getRemind(res.data.alertTime),
              linkPhone:res.data.linkPhone || ''
            })
        }
      }
    })




    var rangeTime = wx.getStorageSync('rangeTime',).map((item,index)=>{
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
    let data=this.data;
    var _this=this;
    if(!data.check){
      this.setData({
        checkMessage:true,
        errorMessage:'请阅读并同意KrMeeing服务须知'
      })
      setTimeout(function(){
        _this.setData({
          checkMessage:false,
          errorMessage:''
        })
      },2000)
      return
    }
    if(!data.order_pay.linkPhone){
        this.setData({
          checkMessage:true,
          errorMessage:'请填写联系电话'
        })
        setTimeout(function(){
          _this.setData({
            checkMessage:false,
            errorMessage:''
          })
        },2000)
        return
    }

    this.closeDialog();

  },
  createOrder:function(){
    let data=this.data;
    var _this=this;
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/order/create',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:{
            alertTime:data.order_pay.alertTime || data.alertTime,
            beginTime:data.meeting_time.beginTime,
            endTime:data.meeting_time.endTime,
            linkPhone:data.order_pay.linkPhone,
            meetingRoomId:data.detailInfo.meetingRoomId,
            themeName:data.order_pay.themeName || data.themeName
          },
          success:(res)=>{
            if(res.data.code<0){
                this.setData({
                  checkMessage:true,
                  errorMessage:res.data.message
                })
                setTimeout(function(){
                  _this.setData({
                    checkMessage:false,
                    errorMessage:''
                  })
                },2000)
            }else{
              this.weChatPay(res.data.data)
              this.closeDialog();
            }

          }
          
        })
  },
  weChatPay:function(data){
    // wx.requestPayment({
    //   'timeStamp':data.timestamp ,
    //   'nonceStr': data.noncestr,
    //   'package': data.packages,
    //   'signType': data.signType,
    //   'paySign': data.paySign,
    //   'success':function(res){

    //   },
    //   'fail':function(res){},
    //   'complete':function(res){},
    // }）
  },
  getMeetDetail(){
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
    console.log('=======',meetingRoomId)
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/detail',
        method:"GET",
        data:{
          "meetingRoomId":meetingRoomId
        },
        success:(res)=>{
          if(res.data.code>0){
            let meetingDetail = res.data.data;
            console.log(meetingDetail.device)
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
  var len=data.length;
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