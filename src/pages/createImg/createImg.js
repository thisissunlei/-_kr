//index.js
import Poster from "../wxa-plugin-canvas/poster/poster";
import { demoAnimate, demoAnimates } from "../../utils/animate.js";

const app = getApp();
Page({
  data: {
    numArr: [{ label: "0" }, { label: "0" }, { label: "0" }],
    number: "290",
    showSuccess: false,
    KrImgUrl: app.globalData.KrImgUrl,
    imgUrl: "",
    showShare: false,
    showRule: false, //活动规则
    noticeList: [], //轮播信息
    currentData: 0, //选项卡
    recordList: [], //好友助力
    helpingList: [], //我的助力
    extractList: [], //提取记录
    showBottomBtn: false,
    hasUserInfo: false,
    totalAmount: null, //好友助力总金额
    myAmout: null, //我的助力总金额
    page: 1,
    totalCount: null,
    totalPages: null
  },
  weChatId: null, //微信id
  page: 1,
  pageSize: 10,
  totalPages: 1,
  jdConfig: {
    width: 765,
    height: 1068,
    backgroundColor: "#fff",
    debug: false,
    images: [
      {
        width: 765,
        height: 1068,
        x: 1,
        y: 0,
        borderRadius: 16,
        url: "/pages/images/shareBg.png",
        zIndex: 2
      }
    ]
  },
  weImg: {
    width: 486,
    height: 486,
    x: 136,
    y: 390,
    url: "",
    zIndex: 1
  },
  james: "",
  onLoad: function() {
    const that = this;
    that.animate();
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          that.setData({
            hasUserInfo: true
          });

          that.login();
        } else {
          that.login();
        }
      }
    });
  },
  //转发分享
  onShareAppMessage: function(res) {
    const that = this;
    if (res.from === "button") {
      // console.log("来自页面赠送按钮");
      console.log(that.weChatId);
      that.share();
      return {
        title: "快来帮我拿自由座礼券，点一下你也能获得礼券哦~",
        path: "pages/assistance/assistance?weChatId=" + that.weChatId,
        imageUrl: that.data.KrImgUrl + "helpingActivity/details/share1.jpg"
      };
    } else {
      // console.log("来自右上角转发菜单");
      return {
        title: "邀请好友助力，商旅办公最高可享免单，快来参与吧~",
        path: "pages/createImg/createImg",
        imageUrl: that.data.KrImgUrl + "helpingActivity/details/share2.jpg"
      };
    }
  },
  share: function() {
    this.setData({
      showBottomBtn: !this.data.showBottomBtn
    });
  },
  //
  checkCurrent: function(e) {
    // console.log(e);
    const that = this;
    let current = e.currentTarget.dataset.current;
    that.setData({
      currentData: current
    });
    if (current == 1) {
      that.getOwerBooster();
    } else if (current == 2) {
      that.getRecords();
    }
  },
  //活动规则
  helpingRule: function() {
    this.setData({
      showRule: true
    });
  },
  //关闭活动规则
  closeRule: function() {
    this.setData({
      showRule: false
    });
  },
  //跳转我的礼品券
  jumpMyCoupon: function() {
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  },
  closeDialog() {
    this.setData({
      showShare: false,
      showSuccess: false
    });
  },
  saveImg() {
    //保存图片到本地
    let that = this;
    // wx.saveImageToPhotosAlbum({
    //     filePath: that.data.imgUrl,
    //     success:function(res){
    //         console.log('success',res)
    that.setData({
      showShare: false,
      showSuccess: true
    });
    //     },
    //     fail:function(res){
    //         console.log('fail',res)
    //     }
    // }, this)
    //保存图片到本地--end
  },
  onPosterSuccess(e) {
    const { detail } = e;
    wx.hideLoading();
    this.setData({
      imgUrl: detail,
      showShare: true
    });
  },
  onPosterFail(err) {
    console.error(err);
  },

  createShareCanvas() {
    let weImg = this.weImg;
    let jdConfig = this.jdConfig;
    let that = this;
    that.share();

    wx.showLoading({
      title: "加载中"
    });

    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/promocode",
      data: {
        page: "pages/activityDetails/activity",
        scene: "8"
      },
      success: res => {
        let code = res.data.code;
        if (code === 1) {
          // weImg.url = res.data.data
          weImg.url = "/pages/images/shi.jpg";
          jdConfig.images.push(weImg);
          this.setData(
            {
              jdConfig: jdConfig
            },
            function() {
              Poster.create();
            }
          );
        } else {
          // weImg.url = res.data.data
          weImg.url =
            "https://img.krspace.cn/activity/image/0/2018/09/25/115630761C2e8epT.jpg";
          jdConfig.images.push(weImg);
          this.setData(
            {
              jdConfig: jdConfig
            },
            function() {
              Poster.create();
            }
          );
        }
      }
    });
  },
  animate() {
    let that = this;
    this.james = new demoAnimate({
      numArr: that.data.numArr,
      number: that.data.number,
      _this: that
    });
  },

  /**
   * 异步生成海报
   */
  onCreatePoster() {
    Poster.create();
  },
  //我的礼券池金额接口
  getBooster: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/mybooster-pool",
      success: res => {
        // console.log(res);
        this.weChatId = res.data.data.weChatId;
      }
    });
  },
  //领取轮播信息接口
  getBroadcast: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/broadcast",
      success: res => {
        // console.log(res);
        that.setData({
          noticeList: res.data.data
        });
      }
    });
  },
  //好友助力接口
  getFriendsBooster: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      data: {
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        // console.log(res);
        that.setData({
          recordList: res.data.data.items,
          totalAmount: res.data.data.totalAmount,
          totalCount: res.data.data.totalCount,
          totalPages: res.data.data.totalPages
        });
      }
    });
  },
  //我的助力接口
  getOwerBooster: function() {
    const that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/owner-booster",
      data: {
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        // console.log(res);
        that.setData({
          helpingList: res.data.data.items,
          myAmout: res.data.data.totalAmount,
          totalCount: res.data.data.totalCount,
          totalPages: res.data.data.totalPages
        });
      }
    });
  },
  //提取记录接口
  getRecords: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/take-records",
      success: res => {
        console.log(res);
      }
    });
  },
  //查询礼券id
  getBoosterInfo: function() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/booster-info",
      success: res => {
        console.log(res);
      }
    });
  },

  //登录
  login: function() {
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
            methods: "GET",
            data: {
              code: res.code
            },
            success: res => {
              wx.hideLoading();
              app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
              app.globalData.openid = res.data.data["openid"];
              that.getBooster();
              that.getBroadcast();
              that.getFriendsBooster();
              that.getBoosterInfo();
            },
            fail: err => {
              console.log(err);
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  //拉取授权
  onGotUserInfo: function(e) {
    // console.log(e);
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
  },
  //获取用户信息
  getInfo: function() {
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        // console.log(res);
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
          success: res => {
            // console.log(res);
          }
        });
      }
    });
  }
});
