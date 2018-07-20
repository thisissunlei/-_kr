const app = getApp()


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    timeweekArr:{},
    month:"",
    day:"",
    week:"",
    sankeNum:1,
    time: '11:00',
    timeFlag:false,
    showError:true,
    errorMessage:'',
    con:1,
    meetingDetail:{},
    themeName:'',
    remind:'提前1天',
    phone:'',
    check:true,
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
    alertTime:'THIRTY',
    order_pay:{},
    priceCount:'0',
    totalCount:'0',
    detailInfo:{},//初始化遍历对象
    orderDate:{},
    meeting_time:{},
    isFirst:true,
    errorMessage:'',
    checkMessage:false,
    dialogDate:false,//判断门板是否显示
    nowDateIndex:wx.getStorageSync('nowDateIndex'),
    topDate:wx.getStorageSync('topDate'),

    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],//便利日历的两条数组
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    ifFirst:false,
  },
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  choose_date:'',
  rangeTime:[],
  selectedTime:[],
  isSubTime:false,
  ifFixed:false,
  // 散座详情弹窗
  openMeetDetail:function(e){
    let that = this;
    that.setData({
      meetingRoomId:'',
      meetDetailShow:!this.data.meetDetailShow
    },function(){
      that.getMeetId()
    })
  },
  // 预计到场时间选择
  jumpSetTheme:function() {
    this.setData({
      timeFlag:!this.data.timeFlag
    }) 
   },
  // 预计到场时间显示
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 预计到场时间隐藏
  jumpSetTime:function() {
    this.setData({
      timeFlag:!this.data.timeFlag
    }) 
   },
  // 数量日历显示与隐藏
   closeDialogDate:function(){
     let that = this;
     that.setData({
       dialogDate:!that.data.dialogDate
     })
   },
  // 数量与日期  隐藏
  closeDialogDate:function(){
    let that = this;
    wx.reportAnalytics('choosedate')
    that.setData({
      dialogDate:!that.data.dialogDate
    })
  },
  // 散客数量加
  add:function(){
    this.setData({
      sankeNum:this.data.sankeNum+=1
    })
    wx.setStorageSync("num",this.data.sankeNum)
   
  },
  // 散客数量减
  jian:function(){
    let num=this.data.sankeNum-=1
    if(num<1){
      num=1
    }
    this.setData({
      sankeNum:num
    })
    wx.setStorageSync("num",this.data.sankeNum)
  },
  // 我在想想
  closeDialog:function(){
    this.setData({
        dialogShow:!this.data.dialogShow,
        // messageShow:true,    
        // typeStatus:false,
        // message:'用户取消支付',
    })
  //   let that=this
  //   setTimeout(function(){
  //     that.setData({
  //       dialogShow:false,
  //       // messageShow:false  
  //   })  
  //   },2000)
  },
  // 立即支付按钮
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
  // 日历选择
  dateBtn :function(e){
    // console.log(e)
    let month=e.target.dataset.month//月份
    let day=e.target.dataset.num+1//今天的号数
    
    this.setData({
      month:month,
      day:day
    })
   
  
    
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
      let dataset=e.target.dataset
      let day_nows = dataset.value;
      if(day_nows == '今天'){
        day_nows = new Date().getDate();
      }else if(day_nows == '明天'){
        day_nows = parseInt(new Date().getDate()) + 1;
      }
      let month=dataset.month>9?dataset.month:`0${dataset.month}`;
      let day=day_nows>9?day_nows:`0${day_nows}`;
      let time=`${dataset.year}-${month}-${day}`;
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
     
      let Time="meeting_time.time";
      
      this.setData({
        orderDate:{
          time:time,
          timeText:day_con,
        },
        nowDateIndex:e.target.dataset.validIndex,
        [Time]:'',
        nowDate:time,
        priceCount:0,
        totalCount:0,
        selectedTime:[],

        
      },function(){
       
        _this.closeDialogDate();
        _this.getThemeName(_this.data.orderDate);
       
      })
      
      wx.setStorageSync("week",this.data.orderDate.timeText)
     
    }
  },
  // 滑动事件
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
  dealDate:function(today_month,bool,choose_date){
    //1.本月开始时间 true  今天的号数
    //2.01年8月 false
    const week = today_month.getDay();//返回当前月份的某一天整数 1-31之间

    if(choose_date){
      this.last_btn_num = parseInt(week)+parseInt(choose_date)-1;//15
    }
    const today = parseInt(new Date().getDate());//当前号数16
    
    today_month.setMonth(today_month.getMonth() + 1);//生成时间戳 大的
    
    today_month.setDate(0);//时间戳 小的 设置一个月的某一天。
    // console.log( today_month.setDate(0))
    const day_num = today_month.getDate()+week;//月份的天数
    const data = [];
    for (var i = 0; i < day_num; i++) {
      // console.log((week+choose_date-1))
      switch (true){
        case i<week:
          data.push({
            value:''
          });
          break;
        case i>(today+week)&&bool://true
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              type:'before'
            });
          }else{
            if(i==(week+choose_date-1)){//false
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
  // 选中按钮
  changeCheckbox:function(){
    this.setData({
        check:!this.data.check
    })
  },
  // 散座详情里 阴影部分
  closeMeetDetail:function(){
      this.setData({
        meetingRoomId:'',
        meetDetailShow:!this.data.meetDetailShow
      })
  },
  // 散座详情 轮播图
  currentChange:function(e){
    if(e.detail.source=="touch"){
      this.setData({
        currentNum:e.detail.current+1
      })
    }
  },
  // 默认的 行程提醒 
  getRemind:function(alertTime){
    let themeObj={
      'NOALERT':'无',
      'FIVE':'提前一小时',
      'FIFTEEN':'提前两小时',
      'THIRTY':'提前一天',
      'THIRTYS':'提前两天',
    }
     return themeObj[alertTime]
    
  },
  // 行程提醒
  jumpSetRemind:function() {
      let data=this.data;
      wx.navigateTo({
        url: '../warn/warn?type=storage&alertTime='+data.alertTime
      })
     
    },
  // 手机号 
  jumpSetPhone:function() {
      let data=this.data;
      wx.navigateTo({
        url: '../phone/phone?type=storage&linkPhone='+data.linkPhone
      })
      
    },
  //查看服务须知
  goToGuide:function(){
    wx.navigateTo({
      url: '../guide/guide'
    })
  },


  //获取 id
  getMeetId(){
    let that = this;
    that.setData({
                meetingRoomId:129
              },function(){
                that.getMeetDetail();
              })
    // wx.getStorage({
    //     key: 'detail-c',
    //     success: function(res) {
    //       if(res.data){
    //         that.setData({
    //           meetingRoomId:res.data.meetingRoomId
    //         },function(){
    //           that.getMeetDetail();
    //         })
    //       }
    //     }
    // })
  },
  // 获取详情
  getMeetDetail(){
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/detail',
        method:"GET",
        data:{
          "seatGoodsId":meetingRoomId
        },
        success:(res)=>{
          console.log("散客详情",res)
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




  onLoad: function (options) {
    this.getPhone();
    var _this=this;
    console.log("safadsfsad", options)
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
          key:'detail-c',
          success:function(res){
            // console.log(res)
            if(res.data){
              _this.setData({
                  detailInfo:res.data//当前散座的一系列数据
                })
            }
          }
        })
    }
    

    wx.getStorage({//获取今天
      key:'orderDate',
      success:function(res){
        if(res.data){
          _this.getThemeName(res.data);
        }
      }
    })
    wx.getStorage({
      key:'meeting_time',
      success:function(res){
        console.log(res)
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
              linkPhone:res.data.linkPhone || _this.data.linkPhone
            })
        }
      }
    })
    
    
    this.setData({
      nowDate:wx.getStorageSync('nowDate'),
      nowDateIndex:wx.getStorageSync('nowDateIndex'),
      topDate:wx.getStorageSync('topDate'),
      timeweekArr:wx.getStorageSync("arr")
    })


    
  },
  onShow:function(){
    var _this=this;
    this.getMeetId()

    wx.getStorage({
      key:'order_pay',
      success:function(res){
        if(Object.keys(res.data).length !=0){
          _this.setData({
              themeName:res.data.themeName || _this.data.themeName,
              remind:_this.getRemind(res.data.alertTime) || _this.getRemind('THIRTY'),
              linkPhone:res.data.linkPhone || _this.data.linkPhone,
              order_pay:res.data,
              alertTime:res.data.alertTime || 'THIRTY'
            })
        }
      }
    })
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
 


  stopPropagation:function(){
    return ;
  },
 

  bool:true,



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
          let date=`${month}${day}`;//0716
          let themeName=date+'会议';//0716会议
          this.setData({
              orderDate:res,//今天time:"2018-07-16"timeText:"今天"
              themeName:themeName//0716会议
          });
          this.choose_date = res.time //2018-07-16
          this.initDate();
  },

  initDate:function(){
    
    const choose_date = new Date(this.choose_date).getDate();//当前号数16
    
    const choose_month = new Date(this.choose_date).getMonth();//6
    

    const today_date = new Date();//当前标准时间Mon Jul 16 2018 18:23:38 GMT+0800 (中国标准时间)
    
    let date1='',date2='';
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)//本月的开始时间Sun Jul 01 2018 00:00:00 GMT+0800 (中国标准时间)
    
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)//Wed Aug 01 2018 00:00:00 GMT+0800 (中国标准时间)
    
    if(choose_month == today_date.getMonth()){//6 ==  6
      this.last_data = 'date_data1';//date_data1
      date1 = this.dealDate(today_month,true,choose_date);//返回数据了
      
      date2 = this.dealDate(next_month,false); 
      // console.log(date2)
    }else if (choose_month == next_month.getMonth()){
      this.last_data = 'date_data2';
      date1 = this.dealDate(today_month,true);
      date2 = this.dealDate(next_month,false,choose_date); 
      console.log(date1)
      console.log(date2)
    }else{
      date1 = this.dealDate(today_month,true);
      date2 = this.dealDate(next_month,false); 
    }
    var validDateNum = 0;
    var that = this;
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
    
    const year_value = today_date.getFullYear()==new Date().getFullYear() ? '' : today_date.getFullYear() + '年';
    this.setData({
      date_data1:date1,
      date_data2:date2,
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
          // console.log(res)//code
          let userInfo=Object.assign({},res.data.data);
          let linkPhone=_this.data.linkPhone;
          _this.setData({
              linkPhone:userInfo.phone || linkPhone
          })
          // console.log(this.data.linkPhone)//''
        }
    })
  },



  // 去支付
  createOrder:function(){
    // app.getRequest({
    //   url:app.globalData.KrUrl+'api/gateway/krmting/common/get-verify-code',
    //   methods:"GET",
    //   data:"17810205921",
    //   header:{
    //     'content-type':"appication/json"
    //   },
    //   success:(res)=>{
    //     console.log(res)
    //   }
    // })
     

      
     
   

    // wx.navigateTo({
    //   url: '../bindPhone/bindPhone'
    // })
  //   this.setData({
  //     dialogShow:!this.data.dialogShow,
  //     typeStatus:true,
  //     message:"用户支付成功",
  //     messageShow:true    
  // })
  // let that=this
  // setTimeout(function(){
  //   that.setData({
  //     messageShow:false  
  // })  
  // },2000)
    this.setData({
      dialogShow:!this.data.dialogShow,
    })
    
    let data=this.data;
    let orderData = {
      
      alertTime: "TWOHOUR",
      linkPhone:data.order_pay.linkPhone || data.linkPhone,
      arrivingTime:data.time,
      quantity:data.sankeNum,
      seatGoodls:129

      // alertTime:data.order_pay.alertTime || data.alertTime,
      // beginTime:data.meeting_time.beginTime,
      // endTime:data.meeting_time.endTime,
      // meetingRoomId:data.detailInfo.meetingRoomId,
      // themeName:data.order_pay.themeName || data.themeName
     
    }
    console.log(orderData)

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    
    var _this=this;
        app.getRequest({
          // 散座下单
          url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/create',
          methods:"GET",
          header:{
            'content-type':"appication/json"
          },
          data:orderData,
          
          success:(res)=>{
            console.log(res)
            let code=res.data.code;
            setTimeout(function(){
              wx.hideLoading();
            },1500)
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
                    }
                  })
                  setTimeout(function(){
                    _this.setData({
                      checkMessage:false,
                      errorMessage:''
                    })
                  },2000)
              break;
              default:
                wx.reportAnalytics('confirmorder')

                _this.weChatPay(res.data.data);
                // _this.closeDialog();
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
        //  微信支付
          wx.requestPayment({
            'nonceStr': data.noncestr,
            'orderld':data.orderld,
            
            'package': data.packages,
            'paySign': data.paySign,
            'signType': data.signType,
            'timeStamp':data.timestamp ,
            'success':function(response){
                wx.showLoading({
                  title: '加载中',
                  mask:true
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
 
})

