
import CAlculagraph from "../../utils/time.js" ;
const app = getApp()


Page({
 
  data: {
    flag:true,
    endTime:"",
    startTime:"",
    timeday:[],
    price:"",
    linkPhone:"",
    con:'',
    sankeNum:"",
    payTitle:'',
    orderId:'',
    meetDetailShow:false,
    autoplay: false,
    duration: 1000,
    currentNum:1,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    meetingRoomId:'',
    titleObj:{},
    ifFixed:false,
    daynum:"",
    carendarArr:[],
    time: '11:00',
    timeFlag: false,
    errorMessage: '',
    meetingDetail: {},
    themeName: '',
    remind: '提前1天',
    phone: '',
    check: true,
    dialogShow: false,
    alertTime: 'ONEDAY',
    order_pay: {},
    priceCount: '0',
    totalCount: '0',
    detailInfo: {},
    orderDate: {},
    meeting_time: {},
    ifFirst: false,
  },
  choose_date: '',

  
  //立即支付
  payOrder:function(){



    let orderId=this.data.orderId;
      app.getRequest({
        // 修改订单
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/edit',
        method:"get",
        data:{
          orderId :orderId,
          alertTime:this.data.alertTime,
          arrivingTime:this.data.time,
          linkPhone:this.data.linkPhone || wx.getStorageSync("order_pay").linkPhone,

        },
        success:(res)=>{
    
          console.log(res)
        
        },
        fail:(error)=>{
            
        }
      })

    let data= wx.getStorageSync("order")
    wx.requestPayment({
      'timeStamp': data.timestamp,
      'nonceStr': data.noncestr,
      'orderId':orderId,
      'package': data.packages,
      'signType':data.signType,
      'paySign': data.paySign,
      'success':function(res){
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        setTimeout(
          function(){
            wx.hideLoading()
          },1500)
      },
      'fail':function(res){
      }
    })
  },

  // 立即支付成功后
  // jumpPaySuccess:function(inviteeId){
  //   wx.navigateTo({
  //     // url: '../paySuccess/paySuccess?inviteeId='+inviteeId
  //     url: '../seatDetail/seatDetail?inviteeId='+inviteeId
  //   })
  // },
  // 预计到场时间选择
  jumpSetTheme: function () {
      this.setData({
        timeFlag: !this.data.timeFlag
      }) 
    
    
   },
  // 预计到场时间
  bindTimeChange: function (e) {
    if (this.data.detailInfo.orderShowStatus === 'CLOSED') {
      return
      this.setData({
        flag:false
      })
  }
    
    this.setData({
      time: e.detail.value
    })
   
    let orderId=this.data.orderId;
      app.getRequest({
        // 修改订单
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/edit',
        method:"get",
        data:{
          orderId :orderId,
          alertTime:this.data.alertTime,
          arrivingTime:this.data.time,
          linkPhone:this.data.linkPhone || wx.getStorageSync("order_pay").linkPhone,
     
        },
        success:(res)=>{
          
          console.log(res)
        
        },
        fail:(error)=>{
            
        }
      })
  },
  // 预计到场时间 隐藏
  jumpSetTime: function () {
    this.setData({
       timeFlag: !this.data.timeFlag
    }) 
   },
  // 散座详情 弹窗
  openMeetDetail:function(){
      let that = this;
      // wx.reportAnalytics('goodsdetails')
      this.setData({
        meetingRoomId:this.data.meetingRoomId,
        meetDetailShow:!this.data.meetDetailShow
      },function(){
        that.getMeetDetail()
      })
  },
  // 散座详情 轮播图
  currentChange: function (e) {
  if (e.detail.source == "touch") {
    this.setData({
      currentNum: e.detail.current + 1
    })
  }
},
  // 散座与详情 关闭
  closeMeetDetail:function(){
    this.setData({
      meetingRoomId:'',
      meetDetailShow:!this.data.meetDetailShow
    })
},
  // 行程提醒
  getRemind: function (alertTime) {
  let themeObj = {
    'NOALERT': '无',
    'ONEHOUR': '提前一小时',
    'TWOHOUR': '提前两小时',
    'ONEDAY': '提前一天',
    'TWODAY': '提前两天',
  }
   return themeObj[alertTime]
  
},
  // 行程提醒jumpSetTheme
  jumpSetRemind: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../warnseat/warnseat?type=storage&alertTime=' + data.alertTime
    })
    
    let orderId=this.data.orderId;
    app.getRequest({
      // 修改订单
      url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/edit',
      method:"get",
      data:{
        orderId :orderId,
        alertTime:this.data.alertTime,
        arrivingTime:this.data.time,
        linkPhone:this.data.linkPhone || wx.getStorageSync("order_pay").linkPhone,

      },
      success:(res)=>{
        
        console.log(res)
      
      },
      fail:(error)=>{
          
      }
    })
    
     
   
    
   
  },
  jumpSetPhone:function() {
    
    let data=this.data;
    wx.navigateTo({
      // url: '../phone/phone?linkPhone='+data.linkPhone+'&type=submit'+'&orderId='+this.data.orderId
      url: '../phone/phone?type=storage&linkPhone=' + data.linkPhone
    })


   
       
    
      
   
    
    if (this.data.detailInfo.orderShowStatus === 'CLOSED') {
      return
  }
   
  },
  // 邀请
  onShareAppMessage: function (res) {
  if (res.from === 'button') {
  }
  //  wx.reportAnalytics('sharemeeting')
  
  let carendarArr = this.data.carendarArr
  for(var item in carendarArr){

  }

  return {
    // title: '戳我一键参会！邀请您于"'+carendarArr[item].month+"月"+carendarArr[item].value+"日"+'"在"'+this.data.detailInfo.buildAndFloorDescr+'"参加"'+"氪空间会议"+'"',
    title: '来来来，发现一个办公的好地儿~',
    desc: "KrMeeting会议室",
    path: 'pages/invitationLetter/invitationLetter?type=ORDER&seatId='+this.data.detailInfo.orderId,
    imageUrl:'../images/map/seativt.png'
  }
},


  onUnload: function () {
    // console.log(this.url_con,6666)
    if(this.data.con==1){
      wx.reLaunch({
        url: '../index/index'
      })
    }
   
    let _this = this;
    
   
    wx.setStorage({
      key: "meeting_time",
      data: {}
    })
    
  },
  //滑动事件
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
  // 获取id
  getMeetId() {
    let that = this;
    wx.getStorage({
        key: 'detail-c',
      success: function (res) {
        if (res.data) {
            that.setData({
            meetingRoomId: res.data.goodsId
          }, function () {
              that.getMeetDetail();
            })
          }
        }
    })
  },
  getBoardroomTime: function () {  
  },
  stopPropagation: function () {
    return;
  },
    //查看散座
    jumpMeet:function() {
      wx.navigateTo({
        url: '../mysanzuo/mysanzuo'
      })
    },
   
   

  onShow: function () {
    let str = wx.getStorageSync("order_pay")
    // console.log(str)
    this.setData({
      linkPhone: str.linkPhone
    })

    this.getDetailInfo(this.data.orderId)
    var _this = this;
    this.getMeetId()
    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime)|| _this.getRemind('ONEDAY') ,
            linkPhone: res.data.linkPhone || _this.data.linkPhone,
            order_pay: res.data,
            alertTime: res.data.alertTime || 'ONEDAY'
            })
        }
      }
    })


    if(this.data.isRouteMy=="2"){
      wx.switchTab({
        url:"../myorder/myorder",
        success:function(e){
          var page =getCurrentPages().pop();
          if(page == undefined || page == null) 
          return;
          page.onLoad();
        }
      })
    }
  },
  bool: true,
  onLoad: function (options) {
  
    
  
   
    
   let id= wx.getStorageSync("order")
   this.setData({
    orderId:id
  })
    var pages=getCurrentPages()
    // console.log(pages)
    var prevPage=pages[pages.length-2]
    prevPage.setData({
      isRouteMy:"2"
    })
    // if(this.data.con==1){
    //   wx.reLaunch({
    //   url: '../index/index'
    //   })
    // }


    let carendar = wx.getStorageSync("data-index")
    carendar.map(item=>{
      // console.log(item)
      if(item.value=="今天"){
        item.month=parseInt(new Date().getMonth()+1)
        item.value=parseInt(new Date().getDate())
        item.zhou="今 天"
      }
      if(item.value=="明天"){
        item.month=parseInt(new Date().getMonth()+1)
        item.value=parseInt(new Date().getDate())+1
        item.zhou="明 天"
      }
    })
  
    this.setData({
      sankeNum:carendar[0].number_a,
      daynum:carendar.length,
      carendarArr:carendar,
      
    })
    




    if(options.con){
      this.setData({
        orderId:options.id,
        con:options.con
      })
    }else{
      this.setData({
        orderId:options.id
      })
    }
  
    

    this.getPhone();
    var _this = this;
    // console.log(options,88800)
    if (options.from == 'list') {
      wx.getStorage({
        key: 'meet_detail',
        success: function (res) {
          if (res.data) {

            _this.setData({
              detailInfo: res.data
              })
          }
        }
      })
    } else {
        wx.getStorage({
        key: 'detail-c',
        success: function (res) {
          console.log(res)
          if (res.data) {
              _this.setData({
              detailInfo: res.data
                })
            }
          }
        })
    }
    

    wx.getStorage({
      key: 'orderDate',
      success: function (res) {
        if (res.data) {
          _this.getThemeName(res.data);
         
        }
      }
    })
    wx.getStorage({
      key: 'meeting_time',
      success: function (res) {
        if (res.data) {
          _this.setData({
            meeting_time: res.data
          })
        }
      }
    })
   
    
    
 

  

  },
  getThemeName: function (res) {
    let timeArr = res.time.split('-');
    let month = timeArr[1];
    let day = timeArr[2];
          // if(month<10){
          //   month=`0${month}`
          // }
          // if(day<10){
          //   day=`0${day}`
          // }
    let date = `${month}${day}`;
          
    let themeName = date + '会议';
          this.setData({
      orderDate: res,
      themeName: themeName
          });
         
          this.choose_date = res.time
  },

  
  getPhone: function () {
    var _this = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
      methods: "GET",
      header: {
        'content-type': "appication/json"
        },
      success: (res) => {
        let userInfo = Object.assign({}, res.data.data);
        let linkPhone = _this.data.linkPhone;
          _this.setData({
          linkPhone: userInfo.phone || linkPhone
          })
        }
    })
  },






  getDetailInfo:function(orderId){
    const _this=this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krseat/seat/order/detail',
        method:"GET",
      data:{
        orderId:orderId
      },
      success:(res)=>{
        console.log("订单详情",res)
       
       

        this.setData({
          time:res.data.data.arrivingTimeDescr,
          linkPhone:res.data.data.linkPhone ,
          alertTime:res.data.data.alertTime,
        })
            let data=res.data.data;
            let isFirst=data.first
            
              let titleObj={
                'OBLIGATION':'待支付订单',
                'TOBEUSED':'待使用订单',
                'USED':'已使用订单',
                'CLOSED':'已取消订单'
              }
              this.setData({
                titleObj:titleObj,
                isFirst:isFirst
              })
              // console.log(isFirst)
              let payTitleObj={
                'OBLIGATION':'应付款',
                'TOBEUSED':'实付款',
                'USED':'实付款',
                'CLOSED':'应付款'
              }
              
              let themeObj={
                'NOALERT': '无',
                'ONEHOUR': '提前一小时',
                'TWOHOUR': '提前两小时',
                'ONEDAY': '提前一天',
                'TWODAY': '提前两天',
              }

              let detailInfo=Object.assign({},data);
              detailInfo.themeTime=themeObj[data.alertTime];

              let arr =[]
              let timeday=data.details;
              timeday.map(item=>{
                  arr.push({
                    enableDate:getMyDate(item.enableDate),
                    promotionCost:item.promotionCost,
                    unitCost:item.unitCost
                  })
                })
                
              this.setData({
                timeday:arr
              })
              // console.log(this.data.timeday)
              let dateArr=changeTime(data.useDate);
              let useDate=dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2];
              let startArr=changeTime(data.beginTime)
              let endArr=changeTime(data.endTime)
              let beginTime=startArr[3]+':'+startArr[4]
              let endTime=endArr[3]+':'+endArr[4];
                  detailInfo.useDate=useDate;
                  detailInfo.beginTime=beginTime;
                  detailInfo.endTime=endTime;
              let hour=(data.endTime-data.beginTime)/3600000;
              let Ctime=changeTime(data.ctime);
              detailInfo.ctime=Ctime[0]+"-"+Ctime[1]+"-"+Ctime[2]+" "+Ctime[3]+":"+Ctime[4]+":"+Ctime[5]
              this.setData({
                payTitle:payTitleObj[data.orderShowStatus],
                detailInfo:detailInfo,
                hour:hour
            })
              wx.setNavigationBarTitle({
                title: titleObj[data.orderShowStatus]
          })
              if(data.orderShowStatus=='OBLIGATION'){
                  _this.startcountDate(detailInfo.expiredTime);
        }
          
             
        },
        fail:(error)=>{
          
      }
    })
   
    
    
    
       
    
  },


  startcountDate:function(date){
    const time = CAlculagraph.CAlculagraph();
    const that = this;
    time.timerMint({
      deadline:date/1000,//最终结束的时间戳,
      callback:function (){
       that.date()
      },//时间结束
      that:this
    });
  },
  //判断时间
  date:function(){
    let timestamp=new Date().getTime();
    if(timestamp>this.data.detailInfo.expiredTime){
      wx.setNavigationBarTitle({
        title:this.data.titleObj.CLOSED
      })
       let orderShowStatus = 'detailInfo.orderShowStatus';
      this.setData({
        [orderShowStatus]:'CLOSED'
      })
    
    }
  },
  // 获取详情
  getMeetDetail() {
 
    let meetingRoomId = this.data.meetingRoomId;
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/goods/detail',
      method: "GET",
      data: {
        "seatGoodsId":meetingRoomId 
      },
      success: (res) => {
        this.setData({
          startTime:res.data.data.startTime,
          endTime:res.data.data.endTime
        })
        // console.log(res)
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;

          that.setData({
            meetingDetail: meetingDetail
          })
          let price=this.data.sankeNum * this.data.daynum * meetingDetail.promotionCost
          let oldprice=this.data.sankeNum * this.data.daynum * meetingDetail.unitCost
          that.setData({
            price:price.toFixed(2),
            oldprice:oldprice.toFixed(2)
          })
        } else {
          that.setData({
            phoneError: false,
            errorMessage: res.data.message,
          })
          setTimeout(function () {
            that.setData({
              phoneError: true,
              errorMessage: '',

            })
          }, 2000)
        }

      },
      fail: (res) => {

        that.setData({
          phoneError: false,
          errorMessage: res.message,
        })
        setTimeout(function () {
          that.setData({
            phoneError: true,
            errorMessage: '',

          })
        }, 2000)

      }
    })
  },

})
function changeTime(date){
  let  myDate =new Date(date) || new Date();
  var myArray =new Array();
  let year=myDate.getFullYear();
  let month =myDate.getMonth()+1;
  let day=myDate.getDate();
  let hour=myDate.getHours();
  let minutes=myDate.getMinutes();
  let seconds=myDate.getSeconds();
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
    myArray[5] = seconds;
    return myArray;
}
function getMyDate(str){  
  var oDate = new Date(str),  
  oYear = oDate.getFullYear(),  
  oMonth = oDate.getMonth()+1,  
  oDay = oDate.getDate(),  
  
  oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);//最后拼接时间  
  return oTime;  
};  
//补0
function getzf(num){  
  if(parseInt(num) < 10){  
      num = '0'+num;  
  }  
  return num;  
}

