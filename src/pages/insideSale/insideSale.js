
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
    btn_bool: true,
  },
  onLoad: function (options) {
    this.setData({
      activityId:options.id
    })
   
     //查看是否授权
     wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
           console.log("用户没有授权：用户信息！");
        } else {
          _this.setData({ btn_bool: false });
        }
      }
    });

     this.getSaleList();
     this.getRecordList(this.data.page);
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
          let data=res.data.data;
         
          data.map((item)=>{
            item.startTime=_this.changeTime(item.effectAt,'.')
            item.endTime=_this.changeTime(item.expireAt,'.')
            return item;
          })
           console.log('res----->>>>saleList',res)
          this.setData({
              saleList:data,
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
        let data=res.data.data;
        data.items.map((item)=>{
          item.time=_this.changeTime(item.ctime,'.',true)
          return item;
        })
        this.setData({
          recordList:data.items,
          totalPages:data.totalPages
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
  },
  getSale(e){
    var _this=this;
    let couponBaseId= e.currentTarget.dataset.id;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/record",
      methods: "POST",
      header: {
        "content-type": "appication/json"
      },
      data: {
        couponBaseId:couponBaseId,
      },
      success: res => {
        if (res.data.code == -1) {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });

        }else{
          wx.showToast({
            title: "领取成功",
            image: "../images/public/success.png",
            duration: 2000
          });
          _this.getSaleList();
          _this.getRecordList(1);
        }

      }
    });
  },
  //授权
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.getSaleList();
      this.getRecordList(1);
      this.setData({
        btn_bool: false
      });
    }
  }
 
})
