
//获取应用实例
const app = getApp();

Page({
  data: {
    imgUrl:app.globalData.KrImgUrl,
    status:'aa',
    saleList:[],
    ruleModal:false,
    activityId:'',
    recordList:[],
    page:1,
    isExpired:false,
    totalPages:1,
  },
  onLoad: function (options) {
    this.setData({
      activityId:options.id
    })
   
    let saleList=[
      {
        "allowance":2,
        "amount":100,
        "couponName":'内部专享礼券1',
        "effectAt":1533830400000,
        "expireAt":1536508800000,
        "ruleType":'NO_THRESHOLD'
      },
      {
        "allowance":1,
        "amount":1000,
        "couponName":'内部专享礼券2',
        "effectAt":1533830400000,
        "expireAt":1536508800000,
        "ruleType":'FULL_REDUCTION',
        'quota':2000
      },
      {
        "allowance":3,
        "amount":500,
        "couponName":'内部专享礼券3',
        "effectAt":1533052800000,
        "expireAt":1538236800000,
        "ruleType":'FULL_REDUCTION',
        'quota':1000

      },
    ]
    let recordList=[
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/banner1.jpg',
        "donatorThirdNick":'易烊千玺',
        "faceValue":50,
        "ctime":1533830400000,
      },
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/nothing.png',
        "donatorThirdNick":'王俊凯' ,
        "faceValue":100,
        "ctime":1538236800000,
      },
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/banner1.jpg',
        "donatorThirdNick":'银临',
        "faceValue":50,
        "ctime":1533052800000,
      },
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/nothing.png',
        "donatorThirdNick":'此处最多8个字超',
        "faceValue":200,
        "ctime":1533830400000,
      },
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/banner1.jpg',
        "donatorThirdNick":'易烊千玺',
        "faceValue":200,
        "ctime":1536508800000,
      },
      {
        "donatorAvatar":app.globalData.KrImgUrl+'/insideSale/banner1.jpg',
        "donatorThirdNick":'易烊千玺',
        "faceValue":200,
        "ctime":1536508800000,
      },
    ];
    var _this=this;
    saleList.map((item)=>{
      item.startTime=_this.changeTime(item.effectAt,'.')
      item.endTime=_this.changeTime(item.expireAt,'.')
      return item;
    })
    recordList.map((item)=>{
      item.time=_this.changeTime(item.ctime,'.',true)
      return item;
    })
   
    this.setData({
      saleList:saleList,
      recordList:recordList,
      totalPages:2,
    });

     //this.getSaleList();
     //this.getRecordList(this.data.page);
  },

  getSaleList(){
    let activityId=this.data.activityId;
    var _this=this;
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/list",
        methods: "GET",
        header: {
          "content-type": "appication/json"
        },
        data: {
          activityId:activityId
        },
        success: res => {
          let isExpired=res.code==2?true:false;
          res.data.crefList.map((item)=>{
            item.startTime=_this.changeTime(item.effectAt,'.')
            item.endTime=_this.changeTime(item.expireAt,'.')
            return item;
          })
           console.log('res----->>>>saleList',res)
          this.setData({
              saleList:res.data.crefList,
              isExpired:isExpired
          });
        }
      });
  },
  getRecordList(page){
    let activityId=this.data.activityId;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/record",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId:activityId,
        page:page
      },
      success: res => {
        console.log('res--->>>>RecordList',res)
        res.data.recordList.map((item)=>{
          item.time=_this.changeTime(item.ctime,'.',true)
          return item;
        })
        this.setData({
          recordList: res.data.recordList,
          totalPages:res.data.totalPages
        });
      }
    });
  },
  myCatchTouch: function () {
    return;
  },
  modalHide(){
    this.setData({
      ruleModal:!this.data.ruleModal
    })
  },
  goToIndex(){
    wx.navigateTo({
      url: "../index/index"
    });
  },
  goToSale(){
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },
  changeTime(data,str,ifHour){
    let date=new Date(data);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds();
    
    if(!ifHour){
      return [year, month, day].map(this.formatNumber).join(str);
    }else{
      return [year, month, day].map(this.formatNumber).join(str) + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
    }
    
  },
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  getMore(){
    let page =this.data.page++;
    this.getRecordList(page);
    this.setData({
      page:page
    })
  }
 
})
