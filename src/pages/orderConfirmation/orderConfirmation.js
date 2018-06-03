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
    dialogTimeShow:true,
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
    dialogDate:false,



    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
  },
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  choose_date:'',
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  dateBtn :function(e){
    
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      
      const new_data = this.data[e.target.dataset.data];
      var old_data = [];
      if(this.last_data!='false'){
        if(this.last_data=='date_data1'){
          old_data = this.data['date_data1'];
          old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
          console.log(old_data[this.last_btn_num]['type'])
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
      let dataset=e.target.dataset
      let time=`${dataset.year}-${dataset.month}-${dataset.value}`;
      //console.log(e.target.dataset,time)
      var _this=this; 
      const time_date = new Date(time);
      const today_date = new Date();
      let day_con = '';
      if(today_date.getDate() == time_date.getDate()){
        day_con = '今天';
      }else if(parseInt(today_date.getDate())+1 == time_date.getDate()){
        day_con = '明天';
      }else{
        switch (parseInt(time_date.getDay())){
          case 0:
            day_con = '周日';
          break;
          case 1:
            day_con = '周一';
          break;
          case 2:
            day_con = '周二';
          break;
          case 3:
            day_con = '周三';
          break;
          case 4:
            day_con = '周四';
          break;
          case 5:
            day_con = '周五';
          break;
          case 6:
            day_con = '周六';
          break;
        }
      }
       

      this.setData({
        orderDate:{
          time:time,
          timeText:day_con,
        },
        newDate:time
      },function(){
        _this.closeDialogDate();
        __this.getThemeName();
      })


      
     
      


    }
  },
  dealDate:function(today_month,bool,choose_date){
    console.log(choose_date,999999)
    //const choose_
    const week = today_month.getDay();
    if(choose_date){
      this.last_btn_num = parseInt(week)+parseInt(choose_date)-1;
    }
    
    console.log(8888,this.last_btn_num)
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
            if(i==(week+choose_date-1)){
              data.push({
                value:i-week+1,
                type:'active next'
              });
            }else{
              data.push({
                value:i-week+1,
                type:'next'
              });
            }
            
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
            if(i==(week+choose_date-1)){
              data.push({
                value:'今天',
                type:'now active'
              });
            }else{
              data.push({
                value:'今天',
                type:'now'
              });
            }
            
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
            if(i==(week+choose_date-1)){
              data.push({
                value:'明天',
                type:'now active'
              });
            }else{
              data.push({
                value:'明天',
                type:'now'
              });
            }
            
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
            if(i==(week+choose_date-1)){
              data.push({
                value:i-week+1,
                type:'active next'
              });
            }else{
              data.push({
                value:i-week+1,
                type:'next'
              });
            }
            
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
  currentChange:function(e){
    if(e.detail.source=="touch"){
      this.setData({
        currentNum:e.detail.current+1
      })
    }
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
              that.getMeetDetail();
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
  closeDialogDate:function(){
    let that = this;
    that.setData({
      dialogDate:!that.data.dialogDate
    })
  },
  tapTime:function(e){
    
    var indexParam = e.currentTarget.dataset.index;
    //console.log(this.data.rangeTime);
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
    //console.log("all",selectedTime);
    if(bool){
      this.setData({
        rangeTime1:[].concat(rangeTime.slice(0,8)),
        rangeTime2:[].concat(rangeTime.slice(8,16)),
        rangeTime3:[].concat(rangeTime.slice(16)),
        rangeTime:[].concat(rangeTime),
        selectedTime:[].concat(selectedTime),
        meeting_time:{
          time:selectedTime[0]?(getTime(selectedTime[0])+'-'+getTime(Number(selectedTime[selectedTime.length-1])+1)):'',
          beginTime:selectedTime[0]?(that.data.nowDate+' '+getTime(selectedTime[0])+':00'):'',
          endTime:selectedTime[0]?(that.data.nowDate+' '+getTime(Number(selectedTime[selectedTime.length-1])+1)+':00'):'',
          hours:selectedTime[0]?getHour(selectedTime):0
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
    //console.log("实际",this.data.selectedTime);
    //console.log(this.data.meeting_time);
    
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
    let hours=data.meeting_time.hours;
    let price=data.detailInfo.promotionCost || data.detailInfo.unitCost;
    let unitCost=data.detailInfo.unitCost;
    let totalCount=price*hours*2;
    let priceCount=unitCost*hours*2;
    
    if(data.isFirst){
      if(hours>2){
        this.setData({
          totalCount:totalCount,
          priceCount:priceCount,
          isFirst:false
        })
      }else{
        this.setData({
          totalCount:totalCount,
          priceCount:1
        })
      }
    }else{
        this.setData({
          totalCount:totalCount,
          priceCount:priceCount
        })
    }
    
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
    this.getPhone();
    var _this=this;
    if(options.from=='list'){
      wx.getStorage({
        key:'meet_detail',
        success:function(res){
          if(res.data){

            _this.setData({
                detailInfo:res.data
              })
          }
        }
      })
    }else{
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
    }
    

    wx.getStorage({
      key:'orderDate',
      success:function(res){
        if(res.data){
          _this.getThemeName(res.data)
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

    
    this.getNowRangeTime();
    

    
    // var rangeTime = wx.getStorageSync('rangeTime').map((item,index)=>{
    //   item.actived = false; 
    //   return item;
    // })
    // console.log(rangeTime);
    this.setData({
    //   rangeTime1:rangeTime.slice(0,8),
    //   rangeTime2:rangeTime.slice(8,16),
    //   rangeTime3:rangeTime.slice(16),
    //   rangeTime:rangeTime,
      nowDate:wx.getStorageSync('nowDate')
    })
    
    
  },
  getThemeName:function(res){
          let timeArr=res.time.split('-');
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
          this.setData({
              orderDate:res.data,
              themeName:themeName
          });
          this.choose_date = res.time
          this.initDate();
  },

  initDate:function(){
    
    const choose_date = new Date(this.choose_date).getDate();
    const choose_month = new Date(this.choose_date).getMonth();
    
    

    const today_date = new Date();
    let date1='',date2='';
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    if(choose_month == today_date.getMonth()){
      this.last_data = 'date_data1';
      date1 = this.dealDate(today_month,true,choose_date);
      date2 = this.dealDate(next_month,false); 
    }else if (choose_month == next_month.getMonth()){
      this.last_data = 'date_data2';
      date1 = this.dealDate(today_month,true);
      date2 = this.dealDate(next_month,false,choose_date); 
    }else{
      date1 = this.dealDate(today_month,true);
      date2 = this.dealDate(next_month,false); 
    }
    
    
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
  getPhone:function(){
    var _this=this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/getWecharUser',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        success:(res)=>{
          let userInfo=Object.assign({},res.data.data);
          _this.setData({
                linkPhone:userInfo.phone
          })
        }
    })
  },
  goToGuide:function(){
    wx.navigateTo({
      url: '../guide/guide'
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
    if(!that.data.dialogTimeShow){
      // that.getMeetDetail();
      that.getNowRangeTime();
    }
    this.setData({
      dialogTimeShow:!that.data.dialogTimeShow
    })
  },
  getNowRangeTime:function(){
    var id = wx.getStorageSync('detail').meetingRoomId || wx.getStorageSync('meet_detail').meetingRoomId;
    var that = this;
    var disableTime = [];
    var newRangeTime = [];
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/room/disableTime',
      methods:"GET",
      data:{
        date:wx.getStorageSync('nowDate'),
        meetingRoomId:id
      },
      header:{
        'content-type':"appication/json"
      },
      success:(res)=>{
        disableTime = res.data.data.disableTime;
        for (let i = 19; i < 39; i++) {
          var rangeTimeItem = {
            disabled:false,
            number: i
          };
          newRangeTime.push(rangeTimeItem);
        }
        newRangeTime.forEach((timeItem,timeIndex) => {
            if(disableTime.indexOf(timeItem.number)>-1){
                timeItem.disabled = true;
            }
        });
        that.setData({
          rangeTime1:newRangeTime.slice(0,8),
          rangeTime2:newRangeTime.slice(8,16),
          rangeTime3:newRangeTime.slice(16),
          rangeTime:newRangeTime,
        })
      }
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

    if(!data.linkPhone){
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
    let orderData = {
      alertTime:data.order_pay.alertTime || data.alertTime,
      beginTime:data.meeting_time.beginTime,
      endTime:data.meeting_time.endTime,
      linkPhone:data.order_pay.linkPhone || data.linkPhone,
      meetingRoomId:data.detailInfo.meetingRoomId,
      themeName:data.order_pay.themeName || data.themeName
    }
    var _this=this;
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/order/create',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:orderData,
          
          success:(res)=>{
            let code=res.data.code;
            switch (code){
              case -1:
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
              break;
              case -2:
                wx.setStorage({
                  key:"create_order",
                  data: {
                    create_order:orderData
                  },
                })
                  wx.navigateTo({
                    url: '../bindPhone/bindPhone'
                  })
              break;
              default:
                _this.weChatPay(res.data.data);
                _this.closeDialog();
                  wx.setStorage({
                    key:"order_pay",
                    data:{},
                    success:function(){
                        _this.setData({
                          order_pay:{}
                        })
                    }
                  })
              break;
            } 

          },
          
        })
       
  },
  weChatPay:function(data){
    var _this=this;
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
      methods:"POST",
      header:{
        'content-type':"appication/json"
      },
      data:{
        orderId:data.orderId
      },
      success:(res)=>{
          wx.requestPayment({
            'timeStamp':data.timestamp ,
            'nonceStr': data.noncestr,
            'package': data.packages,
            'signType': data.signType,
            'paySign': data.paySign,
            'success':function(response){
              _this.getInviteeId(data.orderId);
               
            },
            'fail':function(response){
                wx.navigateTo({
                  url: '../orderDetail/orderDetail?id='+data.orderId
                })
            },
           
          })
      }
    })
    
  },
  getInviteeId(orderId){
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        orderId:orderId
      },
      success:(res)=>{
          wx.navigateTo({
            url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
          })
      }
    })
    
  },
  getMeetDetail(){
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
    //console.log('=======',meetingRoomId)
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/room/detail',
        method:"GET",
        data:{
          "meetingRoomId":meetingRoomId
        },
        success:(res)=>{
          if(res.data.code>0){
            let meetingDetail = res.data.data;
            //console.log(meetingDetail.device)
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