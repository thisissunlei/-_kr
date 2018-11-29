//获取应用实例
const app = getApp();
// 模拟数据
const defaultStyle= {
  backgroudColor:'#b3cef5',
  name:'自由座内部专享礼券',//标题
  headPic:app.globalData.KrImgUrl + "insideSale/banner1.jpg",//头图
  fontColor:'#333',//活动规则字体颜色
  // noticeTitle:'使用规则文案',//使用规则文案
  noticeTitle:'',//使用规则文案
  noticeDescr:'1. 此活动仅限氪空间内部员工参与，请勿外传；#2. 活动时间：截止至2018年9月30日24:00:00 ;#3. 礼券领取后自动存储到您的账户 中，通过授权手机号码可查看和使用礼券；#4. 每种礼券每人限领取1次',//使用须知
  ruleTitle:'领券规则标题',//领券规则标题
  ruleDescr:'领券规则',//领券规则
  sharePic:app.globalData.KrImgUrl + "/insideSale/share.jpg",//分享配图
  shareDescr:'分享文案',//分享文案
}
Page({
  data: {
    imgUrl: app.globalData.KrImgUrl,
    saleList: [],
    ruleModal: false,
    recordList: [],
    pageSize: 10,
    page:1,
    isExpired: false,
    totalPages: 0,
    btn_bool: true,
    styleInfo: {
      headerBanner: app.globalData.KrImgUrl + "insideSale/banner1.jpg",
      fontColor:'#333',
      noticeTitle:'',//使用规则文案
      noticeDescr:'',//使用须知
      ruleTitle:'活动说明',//领券规则标题
      ruleDescr:'',//领券规则
      backgroudColor:'#b3cef5',
    }
  },
  defaultStyle:{},
  activityId:'',
  onShareAppMessage: function(res) {
    let data = this.defaultStyle;
    let activityId = this.activityId
    console.log('onShareAppMessage',data)
    return {
      title: data.shareDescr,
      desc: data.name,
      path: `activities/pages/insideSale/insideSale?id=${activityId}`,
      imageUrl: data.sharePic
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
    console.log('getURLParam',paramValue)
    return paramValue;
  },
  onLoad: function(options) {
    var _this = this;
    let styleInfo = {};
    console.log('onload',options)
    if (options.q) {
      const channelname_v = this.getURLParam(options.q, "id");
      this.activityId = channelname_v;
    }

    if (options.id) {
        this.activityId =  options.id
    }
    // //
    //   _this.setData({
    //     styleInfo: styleType[0]
    //   });
    //   //修改title
      // wx.setNavigationBarTitle({
      //   title: this.data.styleInfo.navigationBarTitle
      // });
    //   //

    this.goLogin();
    // 获取活动基本信息
    this.getBasicInfo()
    //查看是否授权
    wx.getSetting({
      success(res) {
        console.log("scope.userInfo", res.authSetting["scope.userInfo"]);
        if (!res.authSetting["scope.userInfo"]) {
          console.log("用户没有授权：用户信息！");
        } else {
          _this.setData({ btn_bool: false });
        }
      }
    });
  },
  getBasicInfo(){
    let that = this;
    let activityId = this.activityId;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmcoupon/takeactivity/info",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId: activityId
      },
      success: res => {
        if (res.data.code > 0) {
          let data = res.data.data;
          // let data = defaultStyle;
          that.defaultStyle = data;
          let ruleList = []
          let noticeList = []
          if(data.noticeDescr){
            noticeList = data.noticeDescr.split("#")
          }
          if(data.ruleDescr){
            ruleList = data.ruleDescr.split("#")
          }
          let style= {
            headerBanner: data.headPic,
            fontColor:data.fontColor,
            noticeTitle:data.noticeTitle,//使用规则文案
            noticeDescr:data.noticeDescr,//使用须知
            ruleTitle:data.ruleTitle,//领券规则标题
            ruleDescr:data.ruleDescr,//领券规则
            backgroudColor:data.backgroudColor,
            ruleList:ruleList,
            noticeList:noticeList
          }
          that.setData({
            styleInfo:style
          })
          wx.setNavigationBarTitle({
            title: data.name
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      },
      fail:err =>{
        let data = defaultStyle;
          that.defaultStyle = data;
          that.setData({
            headerBanner:data.headPic
          })
        console.log(err)
      }
    });
  },
  goLogin() {
    //页面加载
    let that = this;
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
              that.getInfo();
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
  //获取用户信息
  getInfo: function() {
    var that = this;

    wx.getUserInfo({
      success: function(res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl
        });
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/krmting/user/save",

          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: res => {
            console.log("111");
          }
        });
        //保存到storage里
        wx.setStorage({
          key: "user_info",
          data: {
            user_info: res.userInfo
          }
        });
      },
      fail:function(err){
        console.log(err)
      }
    });
  },
  // 获取优惠券列表
  getSaleList() {
    let activityId = this.activityId;
    var _this = this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/kmcoupon/takeactivity/coupon-list',
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId: activityId
      },
      success: res => {
        if (res.data.code > 0) {
          let isExpired = res.data.code == 2 ? true : false;
          let data = res.data.data;
          if (Object.keys(data).length > 0) {
            data.map(item => {
              item.startTime = _this.changeTime(item.effectAt, ".");
              item.endTime = _this.changeTime(item.expireAt, ".");
              return item;
            });
          }

          this.setData({
            saleList: data,
            isExpired: isExpired
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
  },
  // 获取领取记录
  getRecordList(page) {
    let activityId = this.activityId;
    var _this = this;
    app.getRequest({
      url:
        app.globalData.KrUrl + "api/gateway/kmcoupon/takeactivity/record-by-page",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId: activityId,
        pageSize: 10,
        page:page 
      },
      success: res => {
        if (res.data.code > 0) {
          let data = res.data.data;
          let list = [].concat(this.data.recordList,data.items)
          list = list.map(item => {
            item.time = _this.changeTime(item.ctime, ".", true);
            return item;
          });

          this.setData({
            recordList:list,
            totalPages: data.totalPages
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
  },

  modalHide() {
    this.setData({
      ruleModal: !this.data.ruleModal
    });
  },
  goToIndex() {
    wx.navigateTo({
      url: "../../../pages/index/index?fromPage=inside"
    });
  },
  //新人引导页
  goToPoint() {
    wx.navigateTo({
      url: "../../../pages/point/point"
    });
  },
  goToSale() {
    wx.navigateTo({
      url: "../../../pages/myCoupon/myCoupon"
    });
  },
  changeTime(data, str, ifHour) {
    let date = new Date(data);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    if (!ifHour) {
      return [year, month, day].map(this.formatNumber).join(str);
    } else {
      return (
        [year, month, day].map(this.formatNumber).join(str) +
        " " +
        [hour, minute, second].map(this.formatNumber).join(":")
      );
    }
  },
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  },
  getMore() {
    let page = this.data.page;
    page+= 1;

    this.getRecordList(page);
    this.setData({
      page: page
    });
  },
  getSale(e,id) {
    var _this = this;
    let page = this.data.page;
    let couponBaseId = id ||  e.currentTarget.dataset.id;
    console.log("点击领取",couponBaseId);
    app.getRequest({
      url:
        app.globalData.KrUrl + "api/gateway/kmcoupon/takeactivity/coupon/take",
      method: "POST",
      header: {
        "content-type": "appication/json"
      },
      data: {
        couponBaseId: couponBaseId,
        activityId:_this.activityId
      },
      success: res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: "领取成功",
            image: "../images/success.png",
            duration: 2000
          });
          _this.getSaleList();
          _this.getRecordList(page);
        } else {
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
    console.log('e.currentTarget.dataset.id',e)
    let page = this.data.page;
    let id = e.currentTarget.dataset.id
    if (e.detail.userInfo) {
      this.getInfo();
      this.getSaleList();
      this.getSale('',id)
      this.getRecordList(page);
      this.setData({
        btn_bool: false
      });
    }
  }
});
