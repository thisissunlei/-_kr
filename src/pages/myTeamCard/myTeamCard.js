const app = getApp();
Page({
  data: {
    teamCardList: [
      // {
      //   cardName: "速战速决闪卡",
      //   cardNo: "NO.123456",
      //   remainAmount: 5000,
      //   effectAt: "2018.09.10",
      //   expireAt: "2019.09.09",
      //   id: 1,
      //   cardStatus: "HAS_USER"
      // },
      // {
      //   cardName: "速战速决闪卡",
      //   cardNo: "NO.123456",
      //   remainAmount: 50000,
      //   effectAt: "2018.09.10",
      //   expireAt: "2019.09.09",
      //   id: 2,
      //   cardStatus: "HAS_USER"
      // },
      // {
      //   cardName: "速战速决闪卡",
      //   cardNo: "NO.123456",
      //   remainAmount: 0,
      //   effectAt: "2018.09.10",
      //   expireAt: "2019.09.09",
      //   id: 3,
      //   cardStatus: "HAS_FINISH"
      // },
      // {
      //   cardName: "速战速决闪卡",
      //   cardNo: "NO.123456",
      //   remainAmount: 99,
      //   effectAt: "2018.09.10",
      //   expireAt: "2019.09.09",
      //   id: 4,
      //   cardStatus: "HSA_EXPRIED"
      // }
    ]
  },
  onLoad: function() {
    this.getTeamCard();
  },
  onReady: function() {},
  //购买团队卡
  goBuyTeamCard: function() {},
  //详情页跳转
  jumpCardDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url:
        "../teamCardDetails/teamCardDetails?cardId=" +
        e.currentTarget.dataset.id
    });
  },
  //我的团队卡接口
  getTeamCard: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/list",
      success: res => {
        console.log(res);
        that.setData({
          teamCardList: res.data.data
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  //金额格式化
  toThousands: function(num) {
    var num = (num || 0).toString(),
      result = "";
    while (num.length > 3) {
      result = "," + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  }
});
