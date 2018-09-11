const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    showNone: false,
    teamCardList: []
  },
  onLoad: function() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    this.getTeamCard();
  },
  onShow: function() {
    this.getTeamCard();
  },
  //购买团队卡
  goBuyTeamCard: function() {
    wx.navigateTo({
      url: "../teamCardPurchase/teamCardPurchase"
    });
  },
  //详情页跳转
  jumpCardDetail: function(e) {
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
        wx.hideLoading();
        // console.log(res);
        if (res.data.code == 1) {
          let teamcard = Object.assign({}, res);
          let teamCardList = teamcard.data.data;
          teamCardList.map(item => {
            item.remainAmount = that.toThousands(item.remainAmount);
            item.effectAt = that.toDate(item.effectAt);
            item.expireAt = that.toDate(item.expireAt);
            return item;
          });
          that.setData({
            teamCardList: teamCardList,
            showNone: true
          });
        }
      },
      fail: err => {
        wx.hideLoading();
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
  },
  //时间戳格式化
  toDate: function(number) {
    var date = new Date(number);
    var Y = date.getFullYear();
    var M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return Y + "." + M + "." + D;
  }
});
