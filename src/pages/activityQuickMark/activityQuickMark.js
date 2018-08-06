//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp();
Page({
  data: {
    joinId: null,
    seatStatus: "",
    showHint: true,
    info: {}
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      console.log("来自页面赠送按钮");
      // console.log(res);
      return {
        title: "最酷的【王牌之夜】氪空间大都会社区开业派对活动来咯，戳我参加",
        path: "pages/activityDetails/activity?joinId=" + this.data.joinId,
        imageUrl: this.data.info.coverPic
      };
    } else {
      console.log("来自右上角转发菜单");
      return app.globalData.share_data;
    }
  },

  onLoad: function(options) {
    console.log(options);
    if (options.joinId) {
      this.setData({
        joinId: options.joinId || 0
      });
    }
    // wx.showLoading({ title: "加载中" });
    this.getActivityDetail();
  },
  //我的活动详情接口
  getActivityDetail: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmactivity/join/detail",
      data: {
        joinId: that.data.joinId
      },
      success: function(res) {
        var activityInfo = Object.assign({}, res);
        console.log(activityInfo, "活动详情");
        // console.log(
        //   that.timestamp2Time(`Data(${activityInfo.data.data.endTime})`, "-")
        // );
        // var str = new Date(activityInfo.data.data.beginTime);
        // console.log(str.toLocaleString());
        that.setData({
          info: activityInfo.data.data,
          seatStatus: activityInfo.data.data.joinStatus
        });
        console.log(that.data.info);
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },
  //分享提示
  close: function() {
    this.setData({
      showHint: false
    });
  },
  //取消报名
  cancel: function() {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确认取消报名吗？",
      cancelText: "确定",
      confirmText: "再想想",
      confirmColor: "#F5A623",
      success: function(res) {
        if (res.confirm) {
          // console.log("用户点击再想想");
        } else if (res.cancel) {
          console.log("用户点击确定");

          app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmactivity/join/cancel",
            data: {
              joinId: that.data.joinId
            },
            success: res => {
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: "取消报名成功",
                  icon: "success"
                });
                setTimeout(() => {
                  wx.navigateBack();
                  // wx.navigateBack({
                  //   delta: 2
                  // })
                }, 1500);
              }
            },
            fail: err => {
              console.log(err);
            }
          });
          //

          //
        }
      }
    });
  },
  onReady: function() {
    var that = this;

    if (
      that.data.seatStatus == "EXPIRED" ||
      that.data.seatStatus == "ARRVING"
    ) {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_seat/index.html?inviteeId=" +
          that.data.joinId,
        "mycanvas",
        150,
        150,
        150,
        null,
        "rgba(0,0,0,0.3)"
      );
    } else {
      QR.qrApi.draw(
        "https://web.krspace.cn/kr_seat/index.html?inviteeId=" +
          that.data.joinId,
        "mycanvas",
        150,
        150
      );
    }
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  onShow: function() {},
  timestamp2Time: function(timestamp, separator) {
    var result = "";

    if (timestamp) {
      var reg = new RegExp(/\D/, "g"); //提取数字字符串
      var timestamp_str = timestamp.replace(reg, "");

      var d = new Date();
      d.setTime(timestamp_str);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      result = year + separator + month + separator + day;
    }
    return result;
  }
});
