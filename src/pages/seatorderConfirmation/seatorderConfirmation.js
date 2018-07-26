const app = getApp()


Page({
  /*onShareAppMessage: function() {
    return app.globalData.share_data;
  },*/
  data: {
    seatGoodIds:"",
    orderId:"",
    seatId:"",
    timeweekArr:{},
    carendarArr:[],
    daynum:"",
    sankeNum:1,
    time: '11:00',
    timeFlag: false,
    showError: true,
    errorMessage: '',
    con: 1,
    meetingDetail: {},
    themeName: '',
    remind: '提前1天',
    phone: '',
    check: true,
    dialogShow: false,
    typeStatus: true,
    message: '用户取消支付',
    messageShow: false,
    dialogTimeShow: true,
  
    linkPhone: '',
    selectedTime: [],
    nowDate: '',
    meetDetailShow: false,
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    currentNum: 1,
    timeText: '',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    meetingRoomId: '',
    alertTime: 'ONEDAY',
    order_pay: {},
    priceCount: '0',
    totalCount: '0',
    detailInfo: {}, //初始化遍历对象
    orderDate: {},
    meeting_time: {},
    isFirst: true,
    errorMessage: '',
    checkMessage: false,
    dialogDate: false, //判断门板是否显示
    nowDateIndex: wx.getStorageSync('nowDateIndex'),
    topDate: wx.getStorageSync('topDate'),
 
    date_now: {
      month: '',
      year: '',
      value: ''
    },
    date_next: {
      month: '',
      year: '',
      value: ''
    },
    ifFirst: false,

    // 日历
    week:'',
    arr2:[],
    id:0,
    show_a:false,
    fan:'',
    zheng:true,
    Minimum:null,
    Maximum:null,
    inn:[],//最终数组
    inn1:[],
    splice:[],//暂存数组
    splice_s:[],
    combination:[],
    index1:new Date().getDate(),
    number:1,
    show:false,
    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    arr:[],
  },
  
  seatGoodIds:"",
  choose_date: '',
  selectedTime: [],
  isSubTime: false,
  ifFixed: false,
  combination_new:[],

  // 日历
  arr_index:[],
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  goodid_now:[],
  goodid_next:[],

  // 散座s详情弹窗
  openMeetDetail: function (e) {
    let that = this;
    that.setData({
      meetingRoomId: '',
      meetDetailShow: !this.data.meetDetailShow
    }, function () {
      that.getMeetId()
    })
  },
  // 预计到场时间选择
  jumpSetTheme: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
      
    })
  },
  // 预计到场时间显示
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
      timeFlag: !this.data.timeFlag
    })
  },
  // 预计到场时间隐藏
  jumpSetTime: function () {
    this.setData({
      timeFlag: !this.data.timeFlag
    })
  },
  // 数量日历显示与隐藏
   closeDialogDate:function(){
     this.setData({
       show_a:false
     })
    //  console.log(this.data.id)
    //  wx.redirectTo({
    //    url:"../meeting/meeting?seatId="+this.data.seatId
    //  })
  },
  // 我在想想
  closeDialog: function () {
    this.setData({
      dialogShow: !this.data.dialogShow,
    })
  
  },
  // 立即支付按钮
  goToPay: function () {
    let data = this.data;
    var _this = this;
    if (!data.check) {
      this.setData({
        checkMessage: true,
        errorMessage: '请阅读并同意KrMeeing服务须知'
      })
      setTimeout(function () {
        _this.setData({
          checkMessage: false,
          errorMessage: ''
        })
      }, 2000)
      return
    }

    if (!data.linkPhone) {
      this.setData({
        checkMessage: true,
        errorMessage: '请填写联系电话'
      })
      setTimeout(function () {
        _this.setData({
          checkMessage: false,
          errorMessage: ''
        })
      }, 2000)
      return
    }

    this.closeDialog();

  },
  // 滑动事件
  scrollTopEvent(e) {
    let top = e.detail.scrollTop;

    if (top >= 145) {
      this.setData({
        ifFixed: true
      })
    } else {
      this.setData({
        ifFixed: false
      })
    }

  },
  // 选中按钮
  changeCheckbox: function () {
    this.setData({
      check: !this.data.check
    })
  },
  // 散座详情里 阴影部分
  closeMeetDetail: function () {
    this.setData({
      meetingRoomId: '',
      meetDetailShow: !this.data.meetDetailShow
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
  // 默认的 行程提醒 
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
  // 行程提醒
  jumpSetRemind: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../warn/warn?type=storage&alertTime=' + data.alertTime
    })

  },
  // 手机号 
  jumpSetPhone: function () {
    let data = this.data;
    wx.navigateTo({
      url: '../phone/phone?type=storage&linkPhone=' + data.linkPhone
    })

  },
  //查看服务须知
  goToGuide: function () {
    wx.navigateTo({
      url: '../guide/guide'
    })
  },
  //获取 id
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
  // 获取详情
  getMeetDetail() {
    let that = this;
    let meetingRoomId = this.data.meetingRoomId;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/goods/detail',
      method: "GET",
      data: {
        "seatGoodsId": meetingRoomId
      },
      success: (res) => {
        console.log("散客详情1", res)
        if (res.data.code > 0) {
          let meetingDetail = res.data.data;
          that.setData({
            meetingDetail: meetingDetail
          })
          let price = this.data.sankeNum * this.data.daynum * meetingDetail.promotionCost
          let oldprice = this.data.sankeNum * this.data.daynum * meetingDetail.unitCost
          that.setData({
            // price: price.toFixed(2),
            // oldprice: oldprice.toFixed(2)
            price: price,
            oldprice: oldprice
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
  // 用户状态
  getFirst(){
   
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/isFirstOrder',
      method: "GET",
      success: (res) => {
      this.setData({
        isFirst:res.data.data.first
      })

      },
   
    })
  },

  // 日历
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  diantrue(){
    var that = this;
    
    let fuxiu = []
    let fuxiu_a = []
    this.data.date_data1.map((item,index)=>{
      if(item.kg == true){
        fuxiu.push(item)
      }
    })
    this.data.date_data2.map((item,index)=>{
      if(item.kg == true){
        fuxiu_a.push(item)
      }
    })
    // console.log(fuxiu,fuxiu_a)
    let combination = fuxiu.concat(fuxiu_a)
    combination.map(item=>{
      item.number_a = this.data.number
    })
    // console.log(combination)
    this.setData({
      combination:combination
    })
    this.combination_new= combination;
    console.log(1111)
    wx.setStorageSync('data-index',this.data.combination)
    // console.log(this.data.id)
    // app.getRequest({
    //   url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/list',
    //   methods:"GET",
    //   data:{
    //     seatId:this.data.id
    //   },
    //   success:res=>{
        // console.log(res)
        // let ss = this.data.id
        // setTimeout(function(){
        //   wx.navigateTo({
        //     url:"/pages/seatorderConfirmation/seatorderConfirmation?id="+ss
        //   })
        //     },0)

    //   }
    // })
    this.onClickDate(that);
    this.setData({
      show_a:true
    })
  },
  // fanshow(){
  //   wx.navigateTo({
  //     url:"../seatorderConfirmation/seatorderConfirmation"
  //   })
  // },
  jian(){
    if(this.data.number > 1){
      this.setData({
        number:this.data.number-=1
      })
    }
    let arr_a_a = this.data.date_data1
    let arr_a_a2 = this.data.date_data2
    let edge = []
    arr_a_a.map((item,index)=>{
        if(item.number >= this.data.number){
          item.type = 'next'
          this.setData({
            date_data1:arr_a_a
          })
        }
        if(item.kg == true){
          edge.push(item)
        }
    })
    arr_a_a2.map((item,index)=>{
      if(item.number >= this.data.number){
        item.type = 'next'
        this.setData({
          date_data2:arr_a_a2
        })
      }
      if(item.kg == true){
        edge.push(item)
      }
    })
    edge.sort(function(a,b){
      return a.number - b.number//从小到大
    })
    // console.log(edge)
    if(edge.length == 0){
      this.setData({
        date_data1:arr_a_a,
        date_data2:arr_a_a2,
        zheng:true
      })
    }else{
      this.setData({
        date_data1:arr_a_a,
        date_data2:arr_a_a2,
        Maximum:edge[edge.length-1].number,
        Minimum:edge[0].number
      })
      if(this.data.number < this.data.Maximum){
        let da = this.data.Maximum
        this.setData({
          zheng:true
        })
        // console.log(this.data.number)
      }else{
        this.setData({
          zheng:false
        })
      }
    }
    // console.log(this.data.number,this.data.Maximum)
    
    console.log('最大是'+this.data.Maximum,'最小是'+this.data.Minimum)
    // console.log(this.data.Maximum,this.data.Minimum,this.data.number)
    // if(this.data.number <= this.data.Minimum){
    //   this.setData({
    //     number : this.data.Minimum
    //   })
    //   arr_a_a.map(item=>{
    //     if(item.number < this.data.number){
    //       item.type = 'before'
    //     }
    //   })
    //   arr_a_a2.map(item=>{
    //     if(item.number < this.data.number){
    //       item.type = 'before'
    //       console.log(item)
    //     }
    //   })
    //   this.setData({
    //     date_data1:arr_a_a,
    //     date_data2:arr_a_a2
    //   })
    // }
  },
  jia(){
      this.setData({
        number:this.data.number+=1
      })
    
    let arr_a_a = this.data.date_data1
    let arr_a_a2 = this.data.date_data2
    let edge_a = []
    arr_a_a.map((item,index)=>{
      if(item.number < this.data.number){
        item.kg = false
        item.type = 'before'
      }
      if(item.kg == true){
        edge_a.push(item)
      }
      return item;
    })
    this.setData({
      date_data1:arr_a_a
    })
    arr_a_a2.map((item,index)=>{
      if(item.number < this.data.number){
        item.kg = false
        item.type = 'before'
      }
      if(item.kg == true){
        edge_a.push(item)
      }
      return item;
    })
    // console.log(edge_a)
    edge_a.sort(function(a,b){
      return a.number - b.number//从小到大
    })
    if(edge_a.length == 0){
      this.setData({
        date_data2:arr_a_a2,
        zheng:true
      })
    }else{
        this.setData({
          date_data2:arr_a_a2,
          Maximum:edge_a[edge_a.length-1].number,
          Minimum:edge_a[0].number
        })
        if(this.data.number >= this.data.Maximum){
          let da = this.data.Maximum
          // console.log(da)
          this.setData({
            number : da,
            zheng:false
          })
          // console.log(this.data.number)
        }else{
          this.setData({
            zheng:true
          })
        }
    }
    
    console.log('最大是'+this.data.Maximum,'最小是'+this.data.Minimum)
    // if(this.data.number >= this.data.Maximum){
    //   this.setData({
    //     zheng:false
    //   })
    // }else if(this.data.Minimum < this.data.number && this.data.number < this.data.Maximum){
    //   this.setData({
    //     zheng:true
    //   })
    // }
    // console.log(this.data.Maximum,this.data.Minimum,this.data.number)
    // if(this.data.number >= this.data.Maximum){
    //   this.setData({
    //     number : this.data.Maximum
    //   })
      // arr_a_a.map(item=>{
      //   if(item.number < this.data.number){
      //     item.type = 'before'
      //   }
      // })
      // arr_a_a2.map(item=>{
      //   if(item.number < this.data.number){
      //     item.type = 'before'
      //     console.log(item)
      //   }
      // })
      // this.setData({
      //   date_data1:arr_a_a,
      //   date_data2:arr_a_a2
      // })
    // }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  arr(x){
    x.map((item,index)=>{
      if(item.kg == false){
        this.setData({
          show:false
        })
      }else{
        this.setData({
          show:true
        })
      }
    })
    return this.data.show
  },
  dateBtn :function(e){
    
    console.log(this.data.week,9999)
    const today_a = parseInt(new Date().getDate())
    // console.log(e)
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      // const new_data = this.data[e.target.dataset.data];//遍历的哪条数组
      var old_data = [];
      let aa = e.target.dataset
      let kong_index =this.data.inn
      let kong_index1 =this.data.inn1
      let kong_index_a = this.data.splice
      if(e.target.dataset.data=='date_data2'){
        let ios = this.data.date_data2
        let zuti = e.target.dataset.kg
        let index_zi_a = this.goodid_next;
        console.log(index_zi_a,ios,e.target.dataset.num)
        let inn1 = this.data.inn1
        //------------------
        // const today_date1 = new Date();
        // const next_month = new Date(today_date1.getFullYear(),today_date1.getMonth()+1,1)
        // const week1 = next_month.getDay();//月第一天星期几
        // console.log(week1)
        //----------------------
        
        ios[e.target.dataset.num].kg = !ios[e.target.dataset.num].kg
        index_zi_a[e.target.dataset.num-this.data.week].kg = !index_zi_a[e.target.dataset.num-this.data.week].kg
        this.setData({
          date_data2:ios,
          // date_data2:new_data, 
          //arr1:index_zi_a 
        });
        if(e.target.dataset.kg == true){//取消
          // console.log("用户取消了")
          // console.log(this.data.date_data1[e.target.dataset.num])//false
          let arr_index = []
          this.data.date_data2.map((item,index)=>{
            if(item.kg == true){
              // console.log(item)
              arr_index.push(item)
            }
          })

          // console.log(arr_index)
          this.setData({
            inn1:arr_index
          })
        }else{//选择
          // console.log("用户选择")
          this.data.date_data2.map((item,index)=>{
            console.log(index,e.target.dataset.num)
            if(item.kg == true){
              if(index == e.target.dataset.num){
                let year = e.target.dataset.year, month = e.target.dataset.month-1, date = e.target.dataset.value;// month=6表示7月
            
                // console.log(e)
                  let dt = new Date(year, month, date), dt2 = new Date();
                  let weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                  if(date == '今天'){
                    weekDay[dt.getDay()] = '今天'
                  }else if (date == '明天'){
                    weekDay[dt.getDay()] = '明天'
                  }
                // console.log(weekDay[dt.getDay()])
                item.zhou = weekDay[dt.getDay()]
                item.value = e.target.dataset.value
                item.month = e.target.dataset.month
                item.year = e.target.dataset.year
                item.number_a = this.data.number
                item.arr = e.target.dataset.data
                item.index = e.target.dataset.num
                item.kg = this.data.date_data2[index].kg
                kong_index1.push(item)
                this.setData({
                  inn1:kong_index1
                })
                // console.log(this.data.inn1)
              }
            }
          })
        }
        // console.log(this.data.inn1)
      }else if(e.target.dataset.data=='date_data1'){
        // console.log(this.data.date_data1)
        let ioi = this.data.date_data1
        let zuti = e.target.dataset.kg
        let index_zi = this.goodid_now;
        // console.log(ioi,index_zi)
        ioi[e.target.dataset.num].kg = !ioi[e.target.dataset.num].kg//true
        index_zi[e.target.dataset.num+1-today_a].kg = !index_zi[e.target.dataset.num+1-today_a].kg
       
        this.setData({
          date_data1:ioi,
          // date_data1:new_data,
          //arr:index_zi
        });
        if(e.target.dataset.kg == true){//取消
          console.log("用户取消了")
          // console.log(this.data.date_data1[e.target.dataset.num])//false
          let arr_index = []
          this.data.date_data1.map((item,index)=>{
            if(item.kg == true){
              // console.log(item)
              arr_index.push(item)
            }
          })

          // console.log(arr_index)
          this.setData({
            inn:arr_index
          })
        }else{//选择
          // console.log("用户选择")
          this.data.date_data1.map((item,index)=>{
            if(item.kg == true){
              if(index == e.target.dataset.num){
                var year = e.target.dataset.year, month = e.target.dataset.month-1, date = e.target.dataset.value;// month=6表示7月
                
                  var dt = new Date(year, month, date), dt2 = new Date();
                  var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                  if(date == '今天'){
                    weekDay[dt.getDay()] = '今天'
                  }else if (date == '明天'){
                    weekDay[dt.getDay()] = '明天'
                  }
                // console.log(weekDay[dt.getDay()])
                item.zhou = weekDay[dt.getDay()]
                item.value = e.target.dataset.value
                item.month = e.target.dataset.month
                item.year = e.target.dataset.year
                item.index = e.target.dataset.num
                item.arr = e.target.dataset.data
                item.number_a = this.data.number
                item.kg = this.data.date_data1[index].kg
                kong_index.push(item)
                this.setData({
                  inn:kong_index
                })
                // console.log(this.data.inn)
              }
            }
          })
        }
        // console.log(this.data.inn)
      }
        // if(aa.data == 'date_data1'){}
      this.last_btn_num = e.target.dataset.num;
      this.last_data = e.target.dataset.data;  
      // console.log(e.target.dataset)
    }
    // this.data.arr.map((item,index)=>{
    //   if(item.kg == true){
    //     // console.log(this.data.arr[index])
    //     console.log(item)
    //   }
    // })
  },
  test:function(today_month,bool){
    
    console.log(">>>>>>>data>>>>>",this.goodid_now)
    let index_zhu = this.data
    const week = today_month.getDay();//月第一天星期几
    this.setData({
      week:week
    })
    const today = parseInt(new Date().getDate());//今天是几号
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;//31天+ 星期三==34
    let fu_arr = this.goodid_now
    let fu_arr1 = this.goodid_now
    // for(let i of fu_arr){
    //   i.kg = false
    // }
    // for(let i of fu_arr1){
    //   i.kg = false
    // }

    let new_arr = fu_arr.slice(0,day_num-week-today+1)
    // console.log(new_arr)
    let new_arr1 = fu_arr.slice(day_num-week-today+1);
    this.goodid_next = new_arr1;
    console.log(new_arr,new_arr1)
    let _this = this
    /*this.setData({
      arr2:new_arr,
      arr1:new_arr1
    },function(){
      // console.log(_this.data.arr2,_this.data.arr1)
    })*/
    
    const data = [];
    for (var i = 0; i < day_num; i++) {
      switch (true){
        case i<week:
          data.push({//不是从星期日开始补零
            value:''
          });
          break;
        case i>(today+week)&&bool:
          if(i%7==0||i%7==6){//本月部分不可选，可能数量不足或买完周六日
              data.push({//本月部分不可选，可能数量不足或买完
                value:i-week+1,
                type:'before',
              })
            
          }else{
            console.log(this.goodid_now[i-today+1],'----------------------------------')
            if(this.goodid_now[i-today+1].remainQuantity > 1 && index_zhu.number>this.goodid_now[i-today+1].remainQuantity){
              // this.goodid_now[i].mary='数量不足'
              // console.log("数量不足")
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                id:this.goodid_now[i-today+1].goodsId,
                number:this.goodid_now[i-today+1].remainQuantity,
                mary:this.goodid_now[i-today+1].unitCost,
                mary:this.goodid_now[i-today+1].promotionCost,
              });
            }else if(this.goodid_now[i-today+1].remainQuantity == 0){
              // this.goodid_now[i].mary='已售完'
              // console.log("已售完")
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                number:this.goodid_now[i-today+1].remainQuantity,
                id:this.goodid_now[i-today+1].goodsId,
                mary:this.goodid_now[i-today+1].unitCost,
                no_mary:this.goodid_now[i-today+1].promotionCost,
              });
            }
            else{
              console.log(this.goodid_now1,this.goodid_now[i-today+1].kg,i-today+1,444441111111);
              data.push({
                value:i-week+1,
                type:'next',
                kg:this.goodid_now[i-today+1].kg,
                number:this.goodid_now[i-today+1].remainQuantity,
                id:this.goodid_now[i-today+1].goodsId,
                mary:this.goodid_now[i-today+1].unitCost,
                no_mary:this.goodid_now[i-today+1].promotionCost,
              })
              
            }
          }
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              type:'before',
            });
          }else{
            console.log(this.data.arr,'本月的arr') 
            if(this.goodid_now[i+1-today].remainQuantity < index_zhu.number){
              data.push({//今天可选
                value:'今天',
                type:'before',
                kg:false,
                mary:this.goodid_now[i+1-today].unitCost,
                no_mary:this.goodid_now[i+1-today].promotionCost
              });
            }else{
              // console.log(this.data.arr,'本月的arr')
              data.push({//今天可选
                value:'今天',
                type:'now',
                kg:true,
                number:this.goodid_now[i+1-today].remainQuantity,
                mary:this.goodid_now[i+1-today].unitCost,
                id:this.goodid_now[i-today+1].goodsId,
                no_mary:this.goodid_now[i+1-today].promotionCost,
              });
            }
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              type:'before',
              kg:false,
              number:this.goodid_now[i+1-today].remainQuantity,
              mary:this.goodid_now[i+1-today].unitCost,
              no_mary:this.goodid_now[i+1-today].promotionCost,
            });
          }else{
            if(this.goodid_now[i+1-today].remainQuantity <= this.data.number || this.goodid_now[i+1-today].remainQuantity == 0){
              data.push({//本月明天可选
                value:'明天',
                type:'before',
                kg:false,
                number:this.goodid_now[i+1-today].remainQuantity,
                mary:this.goodid_now[i+1-today].unitCost,
                no_mary:this.goodid_now[i+1-today].promotionCost,
              });
            }else{
              data.push({//本月明天可选
                value:'明天',
                type:'now',
                kg:this.goodid_now[i+1-today].kg,
                number:this.goodid_now[i+1-today].remainQuantity,
                mary:this.goodid_now[i+1-today].unitCost,
                id:this.goodid_now[i+1-today].goodsId,
                no_mary:this.goodid_now[i+1-today].promotionCost,
              }); 
            }
            
          }
          this.all_day_num++;
          break;
          
        case i<(30-this.all_day_num+week-1)&&!bool:
          if(i%7==0||i%7==6){ 
            data.push({//下月部分星期天
              value:i-week+1,
              type:'before',
              name:"周天"
            });
          }else{
          
             console.log(new_arr1,new_arr1[i-week],i-week,111111111111111)
            if(new_arr1[i-week].remainQuantity > 1 && new_arr1[i-week].remainQuantity<index_zhu.number){
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:new_arr1[i-week].kg,
                number:new_arr1[i-week].remainQuantity,
                mary:new_arr1[i-week].unitCost,
                id:new_arr1[i-week].goodsId,
                no_mary:new_arr1[i-week].promotionCost
              });
            }else if(new_arr1[i-week].remainQuantity == 0){
              
              // new_arr1[i].mary='已售完'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:new_arr1[i-week].remainQuantity,
                mary:new_arr1[i-week].unitCost,
                id:new_arr1[i-week].goodsId,
                no_mary:new_arr1[i-week].promotionCost
              });
            }else{
              // console.log(new_arr1[i-week],new_arr1[i-week].kg,22222222111)
              data.push({
                value:i-week+1,
                type:'next',
                kg:new_arr1[i-week].kg,
                number:new_arr1[i-week].remainQuantity,
                mary:new_arr1[i-week].unitCost,
                id:new_arr1[i-week].goodsId,
                no_mary:new_arr1[i-week].promotionCost
              })
            }
          }
          break;
        default:
          data.push({//已经过去的时间灰色不可选
            value:i-week+1,
            type:'before',
            kg:false
          });
          //this.all_day_num++;
        }
      }
      // console.log(data,5555)
      if(bool == true){
        this.setData({
          date_data1:data
        })
      }else if(bool == false){
        this.setData({
          date_data2:data
        })
      }
      console.log(data,6666)
    
  },
  dealDate:function(today_month_new,bool){
    
    var that = this;
   app.getRequest({
     url:app.globalData.KrUrl+"api/gateway/krseat/seat/goods/list",
     methods:"GET",
     data:{
      seatId:1
     },
     success:res=>{
       console.log(res)
      // for(let i of res.data.data){
      //   i.kg = false
      // }
      var curMonth = res.data.data.curMonth;

      const today_month = new Date(curMonth[0].useTime);
      const today_day = today_month.getDate();
      today_month.setMonth(today_month.getMonth() + 1);
      today_month.setDate(0);
      const day_num = today_month.getDate();
      for(var i = 0;i<curMonth.length;i++){
        var tdy = new Date(curMonth[i].useTime).getDate();

        if((i+today_day)==tdy){
          curMonth[i].kg = false;
          that.goodid_now.push(curMonth[i]);
        }else{
          that.goodid_now.push({
            goodsId : "",
            kg:false,
            promotionCost:'',
            remainQuantity:'',
            seatId:'',
            unitCost:'',
            useTime:''
          });
        }
      }
      console.log(that.goodid_now,1111)
      var nextMonth = res.data.data.nextMonth;

      const today_month1 = new Date(nextMonth[0].useTime);
      today_month1.setMonth(today_month1.getMonth() + 1);
      today_month1.setDate(0);
      const day_num1 = today_month1.getDate();
      for(var i = 0;i<nextMonth.length;i++){
        var tdy1 = new Date(nextMonth[i].useTime).getDate();
        console.log(i+1,tdy1,222222)
        if((i+1)==tdy1){
          nextMonth[i].kg = false;
          that.goodid_now.push(nextMonth[i]);
        }else{
          that.goodid_now.push({
            goodsId : "",
            kg:false,
            promotionCost:'',
            remainQuantity:'',
            seatId:'',
            unitCost:'',
            useTime:''
          });
        }
      }
console.log(that.goodid_now,222222)
      //that.goodid_next = res.data.nextMonth;
       /*that.setData({
         arr:res.data.data
       },function(){*/
        //let value = wx.getStorageSync('data-index')
        if(that.combination_new.length===0){
           console.log("没有本地存储")
          /*that.test(today_month_new,bool);*/




        }else{
          //wx.getStorage({key:"data-index",success:res=>{
            let res = that.combination_new
            console.log(res)
            //let arr = that.data.arr;
            //let arr = that.goodid_now;
           

            for(let i of res.data){
              for(let j of that.goodid_now){
                if(i.id == j.goodsId){
                  j.kg = true
                }
              }
            }
             console.log(that.goodid_now,999999)
            that.setData({
              number:res.data[0].number_a,
              //arr : arr
            })
            //console.log(that.data.number)
            //setTimeout(function (){
              //that.test(today_month_new,bool);
            //},10)
          //}})
          
         
        }
          const today_date_1 = new Date();
    
          const today_month_1 = new Date(today_date_1.getFullYear(),today_date_1.getMonth(),1)
          const next_month_1 = new Date(today_date_1.getFullYear(),today_date_1.getMonth()+1,1)
          
          that.test(today_month_1,true);
          // console.log(date1);
          that.test(next_month_1,false);
       //})
     }
   })
    
    
  },


  // 页面加载
  onLoad: function (options) {
    // 日历

    // this.setData({
    //   id:e.id
    // })
    
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    this.dealDate();
    /*const date1 = this.dealDate(today_month,true);
    // console.log(date1);
    const date2 = this.dealDate(next_month,false);*/
    this.setData({
      
      date_now:{
        month:today_date.getMonth()+1,//月
        year:today_date.getFullYear(),//年
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月',  //年月
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月',
        choose:''
      }
    });




    
    this.getFirst()
    this.getMeetId()

    console.log(options)
    this.setData({
      orderId:options.orderId,
      seatId:options.seatId
    })
    
    

    this.getPhone();

    var _this = this;

    if (options.from == 'list') {
      // wx.getStorage({
      //   key: 'meet_detail',
      //   success: function (res) {
      //     if (res.data) {

      //       _this.setData({
      //         detailInfo: res.data
      //       })
      //     }
      //   }
      // })
    } else {
      wx.getStorage({
        key: 'detail-c',
        success: function (res) {
         
          if (res.data) {
            _this.setData({
              detailInfo: res.data //当前散座的一系列数据
            })
          }
        }
      })
    }


    // wx.getStorage({ //获取今天
    //   key: 'orderDate',
    //   success: function (res) {
    //     if (res.data) {
    //       _this.getThemeName(res.data);
    //     }
    //   }
    // })
    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime),
            linkPhone: res.data.linkPhone || _this.data.linkPhone
          })
        }
      }
    })
    
  },
  onClickDate: function (that){
    let carendar = that.combination_new;
    console.log(that.data,carendar,777777)
    
    if(carendar){
    carendar.map(item=>{
      console.log(item)
       item.month=getzf(item.month) 
       item.value=getzf(item.value)

      if(item.value=="今天"){
        item.month=getzf(parseInt(new Date().getMonth()+1))
        item.value=getzf(parseInt(new Date().getDate()))
        item.zhou="今天"
      }
      if(item.value=="明天"){
        item.month=getzf(parseInt(new Date().getMonth()+1))
        item.value=getzf(parseInt(new Date().getDate())+1)
        item.zhou="明天"
      }
      console.log(item)
      return item
    }) 
   
    that.setData({
      sankeNum: carendar[0].number_a,
      daynum: carendar.length,
      carendarArr: carendar,
      // seatGoodIds:
    })
  }
  },
  heider(){
    console.log(1)
    this.setData({
      show_a : true
    })
  },
  onShow: function () {
    var _this = this;
    this.getMeetId()

    wx.getStorage({
      key: 'order_pay',
      success: function (res) {
        if (Object.keys(res.data).length != 0) {
          _this.setData({
            themeName: res.data.themeName || _this.data.themeName,
            remind: _this.getRemind(res.data.alertTime) || _this.getRemind('ONEDAY'),
            linkPhone: res.data.linkPhone || _this.data.linkPhone,
            order_pay: res.data,
            alertTime: res.data.alertTime || 'ONEDAY'
          })
        }
      }
    })
  },
  onUnload: function () {
      wx.removeStorageSync("data-index")
  },


  bool: true,
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
    let date = `${month}${day}`; //0716
    let themeName = date + '会议'; //0716会议
    this.setData({
      orderDate: res, //今天time:"2018-07-16"timeText:"今天"
      themeName: themeName //0716会议
    });
    this.choose_date = res.time //2018-07-16
    
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
        // console.log(res)//code
        let userInfo = Object.assign({}, res.data.data);
        let linkPhone = _this.data.linkPhone;
        _this.setData({
          linkPhone: userInfo.phone || linkPhone
        })
      }
    })
  },
 // 去支付
 createOrder: function () {
  this.setData({
    dialogShow: !this.data.dialogShow,
  })

  let data = this.data;
  // console.log(data.alertTime);
  let orderData = {

    alertTime: data.alertTime,
    linkPhone: data.order_pay.linkPhone || data.linkPhone,
    arrivingTime: data.time,
    quantity: data.sankeNum,
    seatGoodIds: "135,136"
    // seatGoodIds: data.seatGoodIds,

  }

  if (!wx.getStorageSync("myorder")) {
    let orderArr = []
    orderArr.push(orderData)
    wx.setStorageSync("myorder", orderArr)
  } else {
    let orderseat = wx.getStorageSync("myorder")
    orderseat.push(orderData)
    wx.setStorageSync("myorder", orderseat)
  }

  wx.showLoading({
    title: '加载中',
    mask: true
  })

  var _this = this;
  app.getRequest({
    // 散座下单
    url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/create',
    methods: "GET",
    header: {
      'content-type': "appication/json"
    },
    data: orderData,

    success: (res) => {
      console.log("散客下单", res)

      if (!wx.getStorageSync("order-info")) {
        let orderArr = []
        orderArr.push(res.data.data)
        wx.setStorageSync("order-info", orderArr)
      } else {
        let orderseat = wx.getStorageSync("order-info")
        orderseat.push(res.data.data)
        wx.setStorageSync("order-info", orderseat)
      }





      // console.log(res)
      wx.setStorageSync("order", res.data.data)
      let code = res.data.code;
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
      switch (code) {
        case -1:
          this.setData({
            checkMessage: true,
            errorMessage: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              checkMessage: false,
              errorMessage: ''
            })
          }, 2000)
          break;
        case -2:
          wx.setStorage({
            key: "create_order",
            data: {
              create_order: orderData
            },
          })
          wx.navigateTo({
            url: '../bindPhone/bindPhone'
          })
          break;
        case -3:
          this.setData({
            checkMessage: true,
            errorMessage: res.data.message,
            selectedTime: [],
            meeting_time: {
              time: '',
              beginTime: '',
              endTime: '',
              hours: 0,
            }
          })
          setTimeout(function () {
            _this.setData({
              checkMessage: false,
              errorMessage: ''
            })
          }, 2000)
          break;
        default:
          // wx.reportAnalytics('confirmorder')

          wx.requestPayment({
            'nonceStr': res.data.data.noncestr,
            'orderId': res.data.data.orderId,
            'package': res.data.data.packages,
            'paySign': res.data.data.paySign,
            'signType': res.data.data.signType,
            'timeStamp': res.data.data.timestamp,


            'success': function (response) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                // _this.getInviteeId(res.data.data.orderId);
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
                wx.hideLoading();
              }, 1500)

            },
            'fail': function (response) {

              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                wx.hideLoading();
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
              }, 1500)

            },

          })
          // _this.weChatPay(res.data.data);
          // _this.closeDialog();
          // wx.setStorage({
          //   key:"order_pay",
          //   data:{},
          //   success:function(){
          //       _this.setData({
          //         order_pay:{}
          //       })
          //   }
          // })
          break;
      }

    },

  })
  // 日历

  


},
  

})
//补0
function getzf(num){  
  if(parseInt(num) < 10){  
      num = '0'+num;  
  }  
  return num;  
}