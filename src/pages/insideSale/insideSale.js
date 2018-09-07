
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
  onShareAppMessage: function(res) {
    // wx.reportAnalytics("sharekrmeeting");
    // console.log(res);
    return {
      title: "嘿，最优秀的人，自由座内部员工专享礼券来啦，快领～",
      desc: "氪空间自由座",
      path:"pages/insideSale/insideSale?id="+this.data.activityId,
      imageUrl: app.globalData.KrImgUrl+"/insideSale/share.jpg"
    };
  },
  onLoad: function (options) {
    var _this=this;
    this.setData({
      activityId:options.id
    })
    this.goLogin();
  
     //查看是否授权
     wx.getSetting({
      success(res) {
        console.log('scope.userInfo',res.authSetting["scope.userInfo"])
        if (!res.authSetting["scope.userInfo"]) {
           console.log("用户没有授权：用户信息！");
        } else {
          _this.setData({ btn_bool: false });
          
        }
      }
    });

    
   
  },
  goLogin(){
     //页面加载
     let that=this;
     wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            data: {
              code: res.code
            },
            success: function(res) {
              wx.hideLoading();
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getSaleList();
              that.getRecordList(that.data.page);
            }
          });
        } else {
          // console.log("登录失败！" + res.errMsg);
        }
      }
    });
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
          if(res.data.code>0){
            let isExpired=res.data.code==2?true:false;
            let data=res.data.data;
            data.map((item)=>{
              item.startTime=_this.changeTime(item.effectAt,'.')
              item.endTime=_this.changeTime(item.expireAt,'.')
              return item;
            })
            this.setData({
                saleList:data,
                isExpired:isExpired
            });
          }else{
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000
            });
          }
         
        }
      });
  },
  getRecordList(page){
    let activityId=this.data.activityId;
    var _this=this;
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
          if(res.data.code>0){
            let data=res.data.data;
            data.items.map((item)=>{
              item.time=_this.changeTime(item.ctime,'.',true)
              return item;
            })
          
            this.setData({
              recordList:data.items,
              totalPages:data.totalPages
            });
          }else{
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000
            });
          }
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
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/receive",
      method: "POST",
      header: {
        "content-type": "appication/json"
      },
      data: {
        couponBaseId:couponBaseId,
      },
      success: res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: "领取成功",
            image: "../images/public/success.png",
            duration: 2000
          });
          _this.getSaleList();
          _this.getRecordList(1);

        }else{
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
         
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
