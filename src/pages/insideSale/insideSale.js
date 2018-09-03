
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
    isExpired:false,
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
        'frAmount':2000
      },
      {
        "allowance":3,
        "amount":500,
        "couponName":'内部专享礼券3',
        "effectAt":1533052800000,
        "expireAt":1538236800000,
        "ruleType":'FULL_REDUCTION',
        'frAmount':1000

      },
    ]
    var _this=this;
    saleList.map((item)=>{
      item.startTime=_this.changeTime(item.effectAt,'.')
      item.endTime=_this.changeTime(item.expireAt,'.')
      return item;
    })
    this.setData({
      saleList:saleList,
    });
     //this.getSaleList();
     //this.getRecordList();
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
  getRecordList(){
    let activityId=this.data.activityId;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/record",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId:activityId
      },
      success: res => {
        console.log('res--->>>>RecordList',res)
       
        this.setData({
          recordList: res.data.crefList,
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
  changeTime(data,str){
    let date=new Date(data);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds();
    return [year, month, day].map(this.formatNumber).join(str);
  },
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
 
  
  
   
  
 
})
