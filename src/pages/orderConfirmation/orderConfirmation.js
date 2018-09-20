//orderConfirmation.js
//获取应用实例
const app = getApp()

import {dateData,dateDataPrice} from '../../utils/calendar.js';

Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    showError:true,
    errorMessage:'',
    con:1,
    meetingDetail:{},
    themeName:'',
    remind:'提前15分钟',
    phone:'',
    check:true,
    recommendedPhone:'',
    dialogShow:false,
    typeStatus:true,
    message:'用户取消支付',
    messageShow:false,
    dialogTimeShow:true,
    rangeTime1:[],
    rangeTime2:[],
    rangeTime3:[],
    rangeTime:[],
    linkPhone:'',
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
    isFirst:false,
    errorMessage:'',
    checkMessage:false,
    dialogDate:false,
    nowDateIndex:wx.getStorageSync('nowDateIndex'),
    topDate:wx.getStorageSync('topDate'),

    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    couponCount:0,
    saleStatus:'nothing',
    cardStatus:'nothing',
    reducePrice:0,
    imgUrl:app.globalData.KrImgUrl,
    priceInfo:{},
    cardCount:0,
    saleContent:{},
    cardContent:{},
    couponCount:0,

  },
  all_day_num:0,
  last_btn_num:'false',
  last_data:'date_data1',
  choose_date:'',
  rangeTime:[],
  selectedTime:[],
  isSubTime:false,
  ifFixed:false,
  james:'',
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  dateBtn :function(e){
    let _this = this;
      let evlue = this.james.dateBtn(e);
      let selecedList = this.james.getValue()
      let closeDialog = this.james.getSwitch();
      if(!closeDialog){
          return
      }
      let topDate = this.data.topDate;
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
      // 结束

      let Time="meeting_time.time";
      let validIndex = 0;
      let day_week = ''
      topDate.forEach((item,index)=>{
        if(selecedDate === item.date){
          validIndex = index;
          day_week = item.week;
        }
      })
      
      this.setData({
        orderDate:{
          time:selecedDate,
          timeText:day_week,
        },
        nowDateIndex:validIndex,
        [Time]:'',
        nowDate:selecedDate,
        priceCount:0,
        totalCount:0,
        selectedTime:[],
      },function(){
        _this.closeDialogDate()
        _this.getThemeName(_this.data.orderDate);
      })
  },
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
    wx.setStorage({
      key:"meeting_order_sale",
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
  jumpSetRecommendedPhone:function() {
    let data=this.data;
    wx.navigateTo({
      url: '../recommendedPhone/recommendedPhone?type=storage&recommendedPhone='+data.recommendedPhone
    })
    
  },
  getBoardroomTime:function(){
    
  },
  // 打开日期控件
  closeDialogDate:function(){
    let that = this;
    wx.reportAnalytics('choosedate')
    // this.dealDateList()
    that.setData({
      dialogDate:!that.data.dialogDate
    })
  },
  tapTime:function(e){
    
    var indexParam = e.currentTarget.dataset.index;
   
    var test = [].concat(this.data.rangeTime);
   
    // var selectedTime = this.data.selectedTime;
    var selectedTime = [];
    var rangeTime=[];
    
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
    
    
    if(bool){
      this.setData({
        rangeTime1:[].concat(rangeTime.slice(0,8)),
        rangeTime2:[].concat(rangeTime.slice(8,16)),
        rangeTime3:[].concat(rangeTime.slice(16)),
        rangeTime:[].concat(rangeTime),
        selectedTime:[].concat(selectedTime),
        meeting_time:{
          time:selectedTime[0]?(getTime(selectedTime[0])+'-'+getTime(Number(selectedTime[selectedTime.length-1])+1)):'',
          beginTime:selectedTime[0]?(that.data.orderDate.time+' '+getTime(selectedTime[0])+':00'):'',
          endTime:selectedTime[0]?(that.data.orderDate.time+' '+getTime(Number(selectedTime[selectedTime.length-1])+1)+':00'):'',
          hours:selectedTime[0]?getHour(selectedTime):0
        }
      })
    }else{
      this.setData({
        showError:false,
        errorMessage:'请选择连续时间段'
      })
      setTimeout(function(){
        that.setData({
          showError:true,
          errorMessage:''
        })
      },2000)
      // wx.showToast({
      //   title: '请选择连续时间段',
      //   icon: 'none',
      //   duration: 1000
      // })
      return ;
    }
  },
  stopPropagation:function(){
    return ;
  },
  subTime:function(e){
    this.isSubTime = true;
    wx.reportAnalytics('choosetime');
    if(this.data.selectedTime.length>0){
      wx.setStorageSync('meeting_time',this.data.meeting_time);
      this.getPrice();
      this.getIsfirst(this.data.meeting_time);
      this.closeDialogTime();
      wx.setStorage({
        key:"meeting_order_sale",
        data:{}
      })
     

    }
    
  },
  //新金额计算
  getPrice:function(){
    var _this=this;
    let data=this.data;
    let orderData = {
      beginTime:data.meeting_time.beginTime,
      endTime:data.meeting_time.endTime,
      meetingRoomId:data.detailInfo.meetingRoomId,
    }
    
    if(data.saleContent && data.saleContent.couponId){
      orderData.couponId=data.saleContent.couponId;
    }
    if(data.cardContent && data.cardContent.cardId){
      orderData.cardId=data.cardContent.cardId;
    }

   
      app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/kmorder/meeting/calculate',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:orderData,
          success:(res)=>{
              let resData = res.data.data;
              let cardContent = {};
              let cardStatus = _this.data.cardStatus;
              let saleStatus = _this.data.saleStatus;
              let saleContent = {}
              let code=res.data.code;
              
              switch(code){
                case 1:
                if(resData.cardId){
                  cardContent = {
                      name:resData.cardName,
                      remainAmountDecimal:resData.cardDeductAmount,
                      cardId:resData.cardId
                  }
      
                }
                if(resData.couponId){
                  saleContent = {
                    couponId:resData.couponId,
                    amount:resData.couponAmount
                  }
                }
      
                this.setData({
                  cardContent:cardContent,
                  saleContent:saleContent,
                  priceInfo:res.data.data
                })
                wx.setStorage({
                  key:"price_info",
                  data:res.data.data
                })
                
                break;
                case -4:
                  if(saleStatus === 'chosen'){
                    _this.clearStatus(data,'sale');
                    _this.setErrorMessage(res.data.message);
                      wx.getStorage({
                        key: 'price_info',
                        success: function(res) {
                          _this.setData({
                            cardContent:{
                              name:res.data.cardName,
                              remainAmountDecimal:res.data.cardDeductAmount,
                              cardId:res.data.cardId
                            },
                            priceInfo:res.data,
                          })
                        }
                      })
                  }
                break;
                case -5:
                  if(cardStatus === 'chosen'){
                    _this.clearStatus(data,'card');
                    _this.setErrorMessage(res.data.message);
                    wx.getStorage({
                      key: 'price_info',
                      success: function(res) {
                        _this.setData({
                          saleContent:{
                            couponId:res.data.couponId,
                            amount:res.data.couponAmount
                          },
                          priceInfo:res.data
                        })
                      }
                    })
                  }
                break;
              }
          } 
      })
  },
  getIsfirst:function(){
    let data=this.data;
    let orderData = {
      beginTime:data.meeting_time.beginTime,
      endTime:data.meeting_time.endTime,
      meetingRoomId:data.detailInfo.meetingRoomId,
    }
    
    if(data.saleContent && data.saleContent.couponId){
      orderData.couponId=data.saleContent.couponId;
    }
    if(data.cardContent && data.cardContent.cardId){
      orderData.cardId=data.cardContent.cardId;
    }
  
      app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/kmorder/meeting/coupon-teamcard-list',
        methods:"GET",
        header:{
          'content-type':"appication/json"
        },
        data:orderData,
        success:(res)=>{
          let data=res.data.data;
          this.checkStatus(data);
        }
    })
  },
  //校验优惠券状态
  checkStatus(data){
    let saleStatus = '';
    let cardStatus = 'nothing';
    let cardData = data.myCards;
    let saleData = data.myCoupons;
     // 判断礼品券new：新人；chosen：已选，nothing:暂无可用；none:未选择）
    if(saleData.first){
      saleStatus = 'new';
    }else{
      if(saleData.couponCount>0){
        saleStatus = 'none'
      }else{
        saleStatus = 'nothing';
      }
    }
    // 判断团队卡
    if(cardData.cardUsableCount>0){
      cardStatus = 'none'
    } else{
      cardStatus = 'nothing';
    }
    
    this.setData({
      saleStatus:saleStatus,
      isFirst:saleData.first,
      couponCount:saleData.couponCount,
      saleContent:{sale:false},
      cardStatus:cardStatus,
      cardCount:cardData.cardUsableCount,
      cardContent:{sale:false},
      
    })
    this.getPrice();
  },
  clearStatus(data,form){
    var _this=this;
    let orderData = {
      beginTime:data.meeting_time.beginTime,
      endTime:data.meeting_time.endTime,
      meetingRoomId:data.detailInfo.meetingRoomId,
    }
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/kmorder/meeting/coupon-teamcard-list',
      data:orderData,
      method: "GET",
      success: (res) => {
        if(form=='sale'){
          _this.clearSale(res);
        }else if(form=='card'){
          _this.clearCard(res)
        } 
      },
      fail:(res)=>{

      }
   
    })
  },
  clearCard(res){
    let code = res.data.code;
    let cardData = res.data.data.myCards;
    let cardStatus = 'nothing';//暂无
    if(code>0){
      // 判断团队卡
      if(cardData.cardUsableCount>0){
        cardStatus = 'none'//未选
      }
      this.setData({
        cardStatus:cardStatus,
        cardCount:cardData.cardUsableCount,
        cardContent:{card:false},
      })
    }
  },
  clearSale(res){
    let code = res.data.code;
        let saleData = res.data.data.myCoupons;
        let saleStatus = 'nothing';//暂无
        if(code>0){
          // 判断优惠券
          if(saleData.couponCount>0){
            saleStatus = 'none'//未选
          }
          this.setData({
            saleStatus:saleStatus,
            couponCount:saleData.couponCount,
            saleContent:{sale:false},
          })
        }
  },
  //旧金额计算
  // getPrice:function(){
  //   let data=this.data;
  //   let hours=data.meeting_time.hours;
  //   let price=data.detailInfo.promotionCost;
  //   let unitCost=data.detailInfo.unitCost;
  //   let totalCount=unitCost*hours*2;
  //   let priceCount=price*hours*2;
 
  //   if((data.isFirst && data.saleStatus=='new') || (data.isFirst && data.saleStatus=='none')){
  //       this.setData({
  //         totalCount:totalCount,
  //         priceCount:1,
  //       })
  //   }else {
  //     if(data.saleStatus=='chosen'){
  //       if(priceCount-data.reducePrice>0){
  //         priceCount=(priceCount*100-data.reducePrice*100)/100
  //       }else{
  //         priceCount=0;
  //       }
       
  //     }
  //       this.setData({
  //         totalCount:totalCount || 0,
  //         priceCount:priceCount || 0,
  //       })
  //   }
   
  // },
  onShow:function(){
    var _this=this;
    let saleStatus = this.data.saleStatus;
    let cardStatus = this.data.cardStatus;
    let cardCount = this.data.cardCount;
    let couponCount = this.data.couponCount;
    wx.getStorage({
      key:'order_pay',
      success:function(res){
        if(Object.keys(res.data).length !=0){
          _this.setData({
              themeName:res.data.themeName || _this.data.themeName,
              remind:_this.getRemind(res.data.alertTime) || _this.getRemind('FIFTEEN'),
              linkPhone:res.data.linkPhone || _this.data.linkPhone,
              order_pay:res.data,
              alertTime:res.data.alertTime || 'FIFTEEN',
              recommendedPhone:res.data.recommendedPhone
            })
        }
      }
    })
    
    //礼品券数据
    
    if(Object.keys(this.data.meeting_time).length != 0){
        wx.getStorage({
          key: 'meeting_order_sale',
          success: function (res) {

            if(res.data.sale){
              saleStatus = 'chosen';
            }else{
              if(_this.isFirst){
                saleStatus = 'new';
              }else{
                saleStatus = couponCount>0?'none':'nothing'
              }
            }
           
            if(res.data.card){
              cardStatus = 'chosen';
            }else{
              cardStatus = cardCount>0?'none':'nothing'
            }
            
            _this.setData({
              saleStatus:saleStatus,
              saleContent:res.data.sale,
              cardStatus:cardStatus,
              cardContent:res.data.card || {},
            },function(){
              _this.getPrice();
            })
           
            
            
          }
        })
       
        
    }
   
  },
  bool:true,
  //前一天  后一天
  toPreDay:function(e){
    var that = this;
    
    if(this.bool){
      var topDate = this.data.topDate;
      this.bool = false;
      var length = this.data.topDate.length;
      var nowDateIndex = this.data.nowDateIndex;
      if(nowDateIndex<1){
        return ;
      }
      var orderDate = {
        time:topDate[nowDateIndex-1].date,
        timeText:topDate[nowDateIndex-1].week
      }
      this.setData({
        nowDateIndex:nowDateIndex-1,
        nowDate:topDate[nowDateIndex-1].date,
        orderDate:orderDate,
        selectedTime:[],
        meeting_time:{
          time:'',
          beginTime:'',
          endTime:'',
          hours:0,
        }
      },function(){
        that.rangeTime = [];
        that.selectedTime = [];
        that.bool = true;
        that.getNowRangeTime();
        that.getPrice();
        that.getThemeName(orderDate)
        that.dealDateList()
      })
    }
  },
  toNextDay:function(e){
    var that = this;
    if(this.bool){
      this.bool = false;
      var topDate = this.data.topDate;
      var length = this.data.topDate.length;
      var nowDateIndex = this.data.nowDateIndex;
      if(nowDateIndex>length-1){
        return ;
      }
      var orderDate = {
        time:topDate[nowDateIndex+1].date,
        timeText:topDate[nowDateIndex+1].week
      }
      this.setData({
        nowDateIndex:nowDateIndex+1,
        orderDate:orderDate,
        nowDate:topDate[nowDateIndex+1].date,
        selectedTime:[],
        meeting_time:{
          time:'',
          beginTime:'',
          endTime:'',
          hours:0,
        }
      },function(){
        that.rangeTime = [];
        that.selectedTime = [];
        that.bool = true;
        that.getNowRangeTime();
        that.getPrice();
        that.getThemeName(orderDate)
        that.dealDateList()
      })
    }
  },
  onLoad: function (options) {
   
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
          _this.getThemeName(res.data);
          _this.getNowRangeTime();
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
        if(Object.keys(res.data).length != 0){
          _this.setData({
              themeName:res.data.themeName || _this.data.themeName,
              remind:_this.getRemind(res.data.alertTime),
              linkPhone:res.data.linkPhone || _this.data.linkPhone,
              recommendedPhone:''
            })
        }
      }
    })
    
    
    this.setData({
      nowDate:wx.getStorageSync('nowDate'),
      nowDateIndex:wx.getStorageSync('nowDateIndex'),
      topDate:wx.getStorageSync('topDate'),
    },function(){
      _this.initDate();
    })
    
  },
  getThemeName:function(res){
          let timeArr=res.time.split('-');
          let month=timeArr[1];
          let day=timeArr[2];
          // if(month<10){
          //   month=`0${month}`
          // }
          // if(day<10){
          //   day=`0${day}`
          // }
          let date=`${month}${day}`;
          
          let themeName=date+'会议';
          this.setData({
              orderDate:res,
              themeName:themeName
          });
         
          this.choose_date = res.time
  },

  initDate:function(){
    
    const choose_date = new Date(this.choose_date).getDate();
    const choose_month = new Date(this.choose_date).getMonth();
    
    

    const today_date = new Date();
    // let date1='',date2='';
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    // if(choose_month == today_date.getMonth()){
    //   this.last_data = 'date_data1';
    //   date1 = this.dealDate(today_month,true,choose_date);
    //   date2 = this.dealDate(next_month,false); 
    // }else if (choose_month == next_month.getMonth()){
    //   this.last_data = 'date_data2';
    //   date1 = this.dealDate(today_month,true);
    //   date2 = this.dealDate(next_month,false,choose_date); 
    // }else{
    //   date1 = this.dealDate(today_month,true);
    //   date2 = this.dealDate(next_month,false); 
    // }
    var validDateNum = 0;
    var that = this;
    // date1 = date1.map((item,index)=>{
    //   if(item.value && item.type!='before') {
    //     item.validDateNum = validDateNum++;
    //   }
    //   return item;
    // })
    // date2 = date2.map((item,index)=>{
    //   if(item.value && item.type!='before') {
    //     item.validDateNum = validDateNum++;
    //   }
    //   return item;
    // })
    this.dealDateList()
    const year_value = today_date.getFullYear()==new Date().getFullYear() ? '' : today_date.getFullYear() + '年';
    this.setData({
      date_now:{
        month:today_date.getMonth()+1,
        year:today_date.getFullYear(),
        value:year_value+(parseInt(today_date.getMonth())+1) + '月',
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:year_value+(parseInt(today_date.getMonth())+2) + '月',
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
          let linkPhone=_this.data.linkPhone;
          _this.setData({
              linkPhone:userInfo.phone || linkPhone
          })
        }
    })
  },
  goToGuide:function(){
    wx.navigateTo({
      url: '../guide/guide'
    })
  },
  
  
  closeDialogTime:function(){
    var that = this;
    if(!that.data.dialogTimeShow){
      // that.getMeetDetail();
      that.getNowRangeTime();
      this.isSubTime = false;
      this.rangeTime = [].concat(this.data.rangeTime);
      this.selectedTime = [].concat(this.data.selectedTime);
    }else{
      if(!this.isSubTime){
        var rangeTime = this.rangeTime;
        var selectedTime = this.selectedTime;
        this.setData({
          rangeTime1:[].concat(rangeTime.slice(0,8)),
          rangeTime2:[].concat(rangeTime.slice(8,16)),
          rangeTime3:[].concat(rangeTime.slice(16)),
          rangeTime:[].concat(rangeTime),
          selectedTime:[].concat(selectedTime),
          meeting_time:{
            time:selectedTime[0]?(getTime(selectedTime[0])+'-'+getTime(Number(selectedTime[selectedTime.length-1])+1)):'',
            beginTime:selectedTime[0]?(that.data.orderDate.time+' '+getTime(selectedTime[0])+':00'):'',
            endTime:selectedTime[0]?(that.data.orderDate.time+' '+getTime(Number(selectedTime[selectedTime.length-1])+1)+':00'):'',
            hours:selectedTime[0]?getHour(selectedTime):0
          }
        })
      }
    }
    this.setData({
      dialogTimeShow:!that.data.dialogTimeShow
    })
    if(!this.data.dialogTimeShow){
      this.getPhone()
    }
    
  },
  getNowRangeTime:function(){
    var id = this.data.detailInfo.meetingRoomId;
    var that = this;
    var disableTime = [];
    var newRangeTime = [];
    wx.showLoading({
      title: '加载中',
    })
   
    //过滤已过去的时间
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let limitTime = 2*hours+1+(minutes>29?1:0);
    var selectedTime = this.data.selectedTime;
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/room/disableTime',
      methods:"GET",
      data:{
        date:that.data.orderDate.time,
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
            number: i,
            actived:false,
          };
          newRangeTime.push(rangeTimeItem);
        }
        newRangeTime.forEach((timeItem,timeIndex) => {
            if(disableTime.indexOf(timeItem.number)>-1){//过滤已过去的时间
                timeItem.disabled = true;
            }
            if(that.data.orderDate.timeText=="今天" && timeItem.number<limitTime){
                timeItem.disabled = true;
            }
            if(selectedTime.indexOf(timeItem.number)>-1){
                timeItem.actived = true;
            }
        });
        that.setData({
          rangeTime1:newRangeTime.slice(0,8),
          rangeTime2:newRangeTime.slice(8,16),
          rangeTime3:newRangeTime.slice(16),
          rangeTime:newRangeTime,
        },function(){
          wx.hideLoading();
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
    //需要添加推荐人电话字段
    let orderData = {
      alertTime:data.order_pay.alertTime || data.alertTime,
      beginTime:data.meeting_time.beginTime,
      endTime:data.meeting_time.endTime,
      linkPhone:data.order_pay.linkPhone || data.linkPhone,
      meetingRoomId:data.detailInfo.meetingRoomId,
      themeName:data.order_pay.themeName || data.themeName,
      referrerPhone:data.order_pay.recommendedPhone || '',
      validAmount:data.priceInfo.totalAmount 
    }
   
    if(data.saleContent.couponId){
      orderData.couponId=data.saleContent.couponId;
    }
   
    if(data.cardContent.cardId){
      orderData.cardId=data.cardContent.cardId;
    }
    
    
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    var _this=this;
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/kmorder/meeting/create',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:orderData,
          success:(res)=>{
            let code=res.data.code;
            wx.hideLoading();
            switch (code){
              case 1:
                wx.reportAnalytics('confirmorder')
                _this.weChatPay(res.data.data.wxPaySignInfo);
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
              case -2:
                wx.setStorage({
                  key:"create_order",
                  data: {
                    create_order:orderData
                  },
                })
                  wx.navigateTo({
                    url: '../bindPhone/bindPhone?fun=getOrderData'
                  })
              break;
              case -3:
                  this.setData({
                    checkMessage:true,
                    errorMessage:res.data.message,
                    selectedTime:[],
                    meeting_time:{
                      time:'',
                      beginTime:'',
                      endTime:'',
                      hours:0,
                    },
                    ["priceInfo.totalAmount"]:0,
                    saleContent:{sale:false},
                    cardContent:{card:false}
                  })
                  setTimeout(function(){
                    _this.setData({
                      checkMessage:false,
                      errorMessage:''
                    })
                  },2000)
              break;
              case -4:
                this.setData({
                  dialogShow:false,
                  checkMessage:true,
                  errorMessage:res.data.message,
                  saleStatus:'none',
                })
                setTimeout(function(){
                  _this.setData({
                    checkMessage:false,
                    errorMessage:'',
                    saleContent:{sale:false}
                  },function(){
                    _this.getIsfirst(_this.data.meeting_time);
                  })
                 
                },2000)
              break;
              case -5:
                this.setData({
                  dialogShow:false,
                  checkMessage:true,
                  errorMessage:res.data.message,
                  saleStatus:'none',
                })
                setTimeout(function(){
                  _this.setData({
                    checkMessage:false,
                    errorMessage:'',
                    cardContent:{card:false}
                  },function(){
                    _this.getIsfirst(_this.data.meeting_time);
                  })
                 
                },2000)
              break;
              case 2:
                  wx.showLoading({
                    title: '加载中',
                    mask: true
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../orderDetail/orderDetail?id=' + res.data.data.orderId + '&con=' + 1
                    })
                    wx.hideLoading();
                  }, 500)
              
              break;
              default:
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
            } 

          },
          
        })
       
  },
  weChatPay:function(data){
    var _this=this;
    wx.requestPayment({
      'timeStamp':data.timestamp ,
      'nonceStr': data.noncestr,
      'package': data.packages,
      'signType': data.signType,
      'paySign': data.paySign,
      'success':function(response){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          wx.setStorage({
            key:"meeting_order_sale",
            data:{}
          })
         
          setTimeout(function(){
            _this.getInviteeId(data.orderId);
            wx.hideLoading();
          },1500)
         
         
      },
      'fail':function(response){
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        setTimeout(function(){
          wx.hideLoading();
          wx.navigateTo({
            url: '../orderDetail/orderDetail?id='+data.orderId+'&con='+1
          })
        },1500)
         
      },
     
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
        if(res.data.data.inviteeId){
            wx.navigateTo({
              url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
            })
        }else{
          wx.navigateTo({
            url: '../orderDetail/orderDetail?id='+orderId+'&con='+1
          })
        }
          
      }
    })
    
  },
  preventTouchMove(){

  },
  getMeetDetail(){
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
   
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
  jumpSelectSale(){
   let meetingTime=this.data.meeting_time;
   let meetingRoomId=this.data.detailInfo.meetingRoomId;
    wx.setStorage({
      key:"meeting_sale",
      data:{
        meetingRoomId:meetingRoomId,
        beginTime:meetingTime.beginTime,
        endTime:meetingTime.endTime,
      },
      success:function(){
        wx.navigateTo({
          url: '../saleList/saleList?from=meeting'
        })
      }
    })
   
  },
  jumpSetCard(){
    let meetingTime=this.data.meeting_time;
    let meetingRoomId=this.data.detailInfo.meetingRoomId;
    wx.setStorage({
      key: 'meeting_sale',
      data:{
        meetingRoomId:meetingRoomId,
        beginTime:meetingTime.beginTime,
        endTime:meetingTime.endTime,
      },
      success: function(res){
        wx.navigateTo({
          url: '../teamCardList/teamCardList?from=meeting'
        })
      }
    })
  },
  setErrorMessage(msg){
    let that = this;
    this.setData({
      showError:false,
      errorMessage:msg
    },function(){
      setTimeout(function(){
        that.setData({
          showError:true,
          errorMessage:''
        })
      },2000)
    })
  },
  dealDateList:function(){
    let init_date = this.data.nowDate;
    let topDate = this.data.topDate;
    let last_data = ''
    topDate.map(item=>{
      if(item.date === init_date){
        last_data = item.type
      }
    })
    let that = this;
    // const today_date = new Date(init_date);
    // const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1);
    // let init_month = today_month.getTime()
        that.james = new dateData({
          btn_bool:true,
          data: topDate,
          init_data: {
            last_btn_num: init_date, //日期
            last_data: last_data,
          },
        });
        this.setData({
          date_data1: that.james.date_data1,
          date_data2: that.james.date_data2,
        }); 
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