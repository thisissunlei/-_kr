//获取应用实例
const app = getApp();
//活动风格
const styleType = {
  //内部专享礼券
  "0": {
    title: "嘿，最优秀的人，自由座内部员工专享礼券来啦，快领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/share.jpg",
    navigationBarTitle: "自由座内部专享礼券",
    headerBanner: app.globalData.KrImgUrl + "insideSale/banner1.jpg"
  },
  //独立女性专享礼券
  "1": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/share1.jpg",
    navigationBarTitle: "“Be Pink! 2018”独立女性专享礼券",
    headerBanner: app.globalData.KrImgUrl + "insideSale/style1.jpg"
  },
  //三国礼券
  "2": {
    title: "看《三国新说唱》赢创业专享礼券 快来吧！",
    desc: "氪空间自由座",
    imageUrl: "insideSale/share3.jpg",
    navigationBarTitle: "自由座创业专享礼券",
    headerBanner: app.globalData.KrImgUrl + "insideSale/banner2.jpg"
  },
  //行政锦鲤礼券
  "3": {
    title: "快来和我一起拆100元红包，名额有限，先到先得！",
    desc: "氪空间自由座",
    imageUrl: "insideSale/fancy_carp_share.jpg",
    navigationBarTitle: "寻找行政圈锦鲤",
    headerBanner: app.globalData.KrImgUrl + "insideSale/fancy_carp_bg.jpg"
  },
  //设计招聘活动
  "4": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/max_share.jpg",
    navigationBarTitle: "2018 MAX中国社交招聘年度雇主评选",
    headerBanner: app.globalData.KrImgUrl + "insideSale/max_background.jpg"
  },
  //企业专享活动
  "5": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/company_share.jpg",
    navigationBarTitle: "氪空间企业专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/company_bg.jpg"
  },
   //远行地产专享活动
   "8": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/yuanxing_share.jpg",
    navigationBarTitle: "远行地产VIP专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/yuanxing_bg.jpg"
  },
   //点点租专享活动
   "9": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/diandian_share.jpg",
    navigationBarTitle: "点点租VIP专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/diandian_bg.jpg"
  },
   //好租专享活动
   "10": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/haozu_share.jpg",
    navigationBarTitle: "好租VIP专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/haozu_bg.jpg"
  },
   //国贸专享活动
   "11": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/guomao_share.jpg",
    navigationBarTitle: "中海VIP专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/guomao_bg.jpg"
  },
  // 36氪*元璟
  "12": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/bg12.jpg",
    navigationBarTitle: "36氪X元璟沙龙专享福利券 ",
    headerBanner: app.globalData.KrImgUrl + "insideSale/banner12.png",
  },
  // 暖冬行动
  "13": {
    title: "给你送券啦，快来领～",
    desc: "氪空间自由座",
    imageUrl: "insideSale/bg13.jpg",
    navigationBarTitle: "暖冬行动专享礼券",
    headerBanner: app.globalData.KrImgUrl + "insideSale/banner13.jpg",
  },
  // 行动
  "14": {
    title: "快来和我一起疯狂拆礼包！560元礼包等你来抢！",
    desc: "氪空间自由座",
    imageUrl: "insideSale/bg14.jpg",
    navigationBarTitle: "京东会员专享礼包",
    headerBanner: app.globalData.KrImgUrl + "insideSale/banner14.jpg"
  },
};

Page({
  data: {
    imgUrl: app.globalData.KrImgUrl,
    status: "aa",
    saleList: [],
    ruleModal: false,
    activityId: "",
    recordList: [],
    pageSize: 10,
    isExpired: false,
    totalCount: 0,
    btn_bool: true,
    style: "",
    styleInfo: {
      title: "嘿，最优秀的人，自由座内部员工专享礼券来啦，快领～",
      desc: "氪空间自由座",
      imageUrl: "/insideSale/share.jpg",
      navigationBarTitle: "自由座内部专享礼券",
      headerBanner: app.globalData.KrImgUrl + "insideSale/banner1.jpg"
    }
  },
  onShareAppMessage: function(res) {
    // wx.reportAnalytics("sharekrmeeting");
    let data = this.data;
    let style = data.style || "";
    return {
      title: data.styleInfo.title,
      desc: data.styleInfo.desc,
      path: `pages/insideSale/insideSale?id=${data.activityId}&style=${style}`,
      imageUrl: app.globalData.KrImgUrl + data.styleInfo.imageUrl
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
  onLoad: function(options) {
    var _this = this;
    let styleInfo = {};
    if (options.q) {
      const channelname_v = this.getURLParam(options.q, "id");
      let style = this.getURLParam(options.q, "style");
      this.setData(
        {
          activityId: channelname_v,
          style: style || ""
        },
        function() {
          if (styleType[style]) {
            styleInfo = styleType[style];
          } else {
            styleInfo = styleType[0];
          }
          _this.setData({
            styleInfo: styleInfo
          });
          //修改title
          wx.setNavigationBarTitle({
            title: styleInfo.navigationBarTitle
          });
        }
      );
    }

    if (options.id) {
      this.setData({
        activityId: options.id
      });
    }
    if (options.style) {
      this.setData(
        {
          style: options.style
        },
        function() {
          _this.setData({
            styleInfo: styleType[options.style]
          });
          //修改title
          wx.setNavigationBarTitle({
            title: styleType[options.style].navigationBarTitle
          });
        }
      );
    } else {
      _this.setData({
        styleInfo: styleType[0]
      });
      //修改title
      wx.setNavigationBarTitle({
        title: styleType[0].navigationBarTitle
      });
    }

    this.goLogin();

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
              that.getRecordList(that.data.pageSize);
              console.log("res---", res);
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
      }
    });
  },
  getSaleList() {
    let activityId = this.data.activityId;
    var _this = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/list",
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

  getRecordList(pageSize) {
    let activityId = this.data.activityId;
    var _this = this;
    app.getRequest({
      url:
        app.globalData.KrUrl + "api/gateway/krcertificate/certificate/record",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        activityId: activityId,
        pageSize: pageSize
      },
      success: res => {
        if (res.data.code > 0) {
          let data = res.data.data;
          data.items.map(item => {
            item.time = _this.changeTime(item.ctime, ".", true);
            return item;
          });

          this.setData({
            recordList: data.items,
            totalCount: data.totalCount
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
      url: "../index/index?fromPage=inside"
    });
  },
  //新人引导页
  goToPoint() {
    wx.navigateTo({
      url: "../point/point"
    });
  },
  goToSale() {
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
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
    let pageSize = this.data.pageSize;
    pageSize += 10;

    this.getRecordList(pageSize);
    this.setData({
      pageSize: pageSize
    });
  },
  getSale(e) {
    var _this = this;
    var pageSize = this.data.pageSize;
    let couponBaseId = e.currentTarget.dataset.id;
    console.log("点击领取");
    app.getRequest({
      url:
        app.globalData.KrUrl + "api/gateway/krcertificate/certificate/receive",
      method: "POST",
      header: {
        "content-type": "appication/json"
      },
      data: {
        couponBaseId: couponBaseId
      },
      success: res => {
        console.log("res---", res);
        if (res.data.code == 1) {
          wx.showToast({
            title: "领取成功",
            image: "../images/public/success.png",
            duration: 2000
          });
          _this.getSaleList();
          _this.getRecordList(pageSize);
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
    let pageSize = this.data.pageSize;
    if (e.detail.userInfo) {
      this.getInfo();
      this.getSaleList();
      this.getRecordList(pageSize);
      this.setData({
        btn_bool: false
      });
    }
  }
});
