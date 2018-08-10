//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp();
Page({
  data: {
    joinId: null,
    seatStatus: "",
    showHint: true,
    beginTime: {},
    endTime: {},
    info: {}
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      console.log("来自页面赠送按钮");
      // console.log(res);
      return {
        title: this.data.info.title + "活动来咯，戳我参加~",
        path:
          "pages/activityDetails/activity?activityId=" +
          this.data.info.activityId,
        imageUrl: this.data.info.coverPic
      };
    } else {
      console.log("来自右上角转发菜单");
      return app.globalData.share_data;
    }
  },

  onLoad: function(options) {
    // console.log(new Date("2019-08-08 11:00:00").getTime());
    console.log(options);
    if (options.joinId) {
      this.setData({
        joinId: options.joinId || 0
      });
    }
    wx.showLoading({ title: "加载中" });
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
        wx.hideLoading();
        var activityInfo = Object.assign({}, res);
        console.log(activityInfo, "活动详情");
        that.setData({
          info: activityInfo.data.data,
          seatStatus: activityInfo.data.data.joinStatus
        });
        that.getTime("beginTime", that.data.info.beginTime);
        that.getTime("endTime", that.data.info.endTime);
        that.renderQR();
        console.log(that.data.beginTime, that.data.endTime);
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
                  image: "../images/public/success.png",
                  mask: true
                });
                setTimeout(() => {
                  wx.navigateBack();
                  // wx.navigateBack({
                  //   delta: 2
                  // })
                }, 1500);
              } else if (res.data.code == -1) {
                wx.showToast({
                  title: res.data.message,
                  image: "../images/public/error.png",
                  mask: true
                });
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

  //

  renderQR() {
    var that = this;
    console.log("that.data.seatStatus", that.data.seatStatus);

    if (
      that.data.seatStatus === "EXPIRED" ||
      that.data.seatStatus === "ARRVING"
    ) {
      QR.qrApi.draw(
        "http://web.krspace.cn/devtest/kr-meeting-activity06/index.html?joinId=" +
          that.data.joinId,
        "mycanvas",
        160,
        160,
        null,
        "rgba(0,0,0,0.3)"
      );
    } else {
      QR.qrApi.draw(
        "http://web.krspace.cn/devtest/kr-meeting-activity06/index.html?joinId=" +
          that.data.joinId,
        "mycanvas",
        160,
        160
      );
    }
  },
  //
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  getTime(state, time) {
    let week = "";
    switch (new Date(parseInt(time)).getDay()) {
      case 0:
        week = "周日";
        break;
      case 1:
        week = "周一";
        break;
      case 2:
        week = "周二";
        break;
      case 3:
        week = "周三";
        break;
      case 4:
        week = "周四";
        break;
      case 5:
        week = "周五";
        break;
      case 6:
        week = "周六";
        break;
    }
    let h =
      new Date(parseInt(time)).getHours() >= 10
        ? new Date(parseInt(time)).getHours()
        : "0" + new Date(parseInt(time)).getHours();
    let m =
      new Date(parseInt(time)).getMinutes() >= 10
        ? new Date(parseInt(time)).getMinutes()
        : "0" + new Date(parseInt(time)).getMinutes();
    let M =
      new Date(parseInt(time)).getMonth() + 1 >= 10
        ? new Date(parseInt(time)).getMonth() + 1
        : "0" + (new Date(parseInt(time)).getMonth() + 1);
    let D =
      new Date(parseInt(time)).getDate() >= 10
        ? new Date(parseInt(time)).getDate()
        : "0" + new Date(parseInt(time)).getDate();

    let day = {
      y: new Date(parseInt(time)).getFullYear() + "-",
      d: M + "-" + D + " (" + week + ") ",
      t: h + ":" + m
    };
    this.setData({
      [state]: day
    });
  }
});
