//index.js
import Poster from "../wxa-plugin-canvas/poster/poster";
const app = getApp();
Page({
  data: {
    showSuccess: false,
    KrImgUrl: app.globalData.KrImgUrl,
    imgUrl: "",
    showShare: false,
    showRule: false, //活动规则
    noticeList: [
      { text: "猫力大大美 3分钟前 提取了 30元礼券" },
      { text: "猫力大大美 4分钟前 提取了 50元礼券" },
      { text: "猫力大大美 5分钟前 提取了 100元礼券" }
    ],
    currentData: 0, //选项卡
    recordList: [
      {
        thirdAvatar: "头像",
        thirdNick: "昵称",
        amount: "助力金额",
        first: true,
        text: "助力文案"
      },
      {
        thirdAvatar: "头像1",
        thirdNick: "昵称1",
        amount: "助力金额1",
        first: true,
        text: "助力文案1"
      },
      {
        thirdAvatar: "头像2",
        thirdNick: "昵称2",
        amount: "助力金额2",
        first: false,
        text: "助力文案2"
      }
    ]
  },
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
    x: 141,
    y: 390,
    url: "",
    zIndex: 1
  },
  //转发分享
  onShareAppMessage: function(res) {
    // wx.reportAnalytics("sharekrmeeting");
    // console.log(res);
  },
  //
  checkCurrent: function(e) {
    // console.log(e);
    const that = this;
    that.setData({
      currentData: e.currentTarget.dataset.current
    });
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

  /**
   * 异步生成海报
   */
  onCreatePoster() {
    Poster.create();
  }
});
