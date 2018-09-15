
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
    pageSize:5,
    isExpired:false,
    totalCount:0,
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
  getURLParam: function(deal_url, paramName) {
    var paramValue = "";
    var isFound = false;
    deal_url = decodeURIComponent(deal_url)
      .substring(1, deal_url.length)
      .split("?")[1];
    if (deal_url.indexOf("=") > 1) {
      let arrSource = deal_url.split("&");
      let i = 0;
      while (i < arrSource.length && !isFound) {
        if (arrSource[i].indexOf("=") > 0) {
          if (
            arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()
          ) {
            paramValue = arrSource[i].split("=")[1];
            isFound = true;
          }
        }
        i++;
      }
    }
    return paramValue;
  },
  onLoad: function (options) {
    var _this=this;
    if (options.q) {
      const channelname_v = this.getURLParam(options.q, "id");
      this.setData({
        activityId:channelname_v
      })
       console.log(channelname_v, 11111);
    }
   
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
              app.globalData.Cookie = res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getInfo();
              that.getSaleList();
              that.getRecordList(that.data.pageSize);
              console.log('res---',res)
            }
          });
        } else {
          // console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
   //获取用户信息
   getInfo: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl
        });
        //保存到storage里
        wx.setStorage({
          key: "user_info",
          data: {
            user_info: res.userInfo
          }
        });
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/krmting/user/save",

          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: res => {}
        });
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
            if(Object.keys(data).length>0){
               data.map((item)=>{
                item.startTime=_this.changeTime(item.effectAt,'.')
                item.endTime=_this.changeTime(item.expireAt,'.')
                return item;
              })
            }
           
           
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
    
  getRecordList(pageSize){
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
        pageSize:pageSize
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
              totalCount:data.totalCount
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
   
    let pageSize=this.data.pageSize;
    pageSize+=5
   
    this.getRecordList(pageSize);
    this.setData({
      pageSize:pageSize
    })
  },
  getSale(e){
    var _this=this;
    var pageSize=this.data.pageSize
    let couponBaseId= e.currentTarget.dataset.id;
    console.log('点击领取')
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
        console.log('res---',res)
        if (res.data.code == 1) {
          wx.showToast({
            title: "领取成功",
            image: "../images/public/success.png",
            duration: 2000
          });
          _this.getSaleList();
          _this.getRecordList(pageSize);

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
    let pageSize=this.data.pageSize;
    if (e.detail.userInfo) {
      this.getSaleList();
      this.getRecordList(pageSize);
      this.setData({
        btn_bool: false
      });
    }
  }
 
})
