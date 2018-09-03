const app = getApp();
Page({
  data: {
    teamCardList: [
      {
        name: "速战速决闪卡",
        type: "1",
        number: "NO.123456",
        coust: 5000,
        time: "使用期限：2018.09.10-2019.09.09",
        stause: "unused",
        id: 1
      },
      {
        name: "多块好省闪卡",
        type: "2",
        number: "NO.123456",
        coust: 50000,
        time: "使用期限：2018.09.10-2019.09.09",
        stause: "unused",
        id: 2
      },
      {
        name: "速战速决闪卡",
        type: "1",
        number: "NO.123456",
        coust: 0,
        time: "使用期限：2018.09.10-2019.09.09",
        stause: "used",
        id: 3
      },
      {
        name: "速决闪卡",
        type: "2",
        number: "NO.123456",
        coust: 99,
        time: "使用期限：2018.09.10-2019.09.09",
        stause: "ex",
        id: 4
      }
    ]
  },
  onLoad: function() {},
  onReady: function() {},
  //购买团队卡
  goBuyTeamCard: function() {},
  //详情页跳转
  jumpCardDetail: function() {},
  //我的团队卡接口
  getTeamCard: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmactivity/my/list",
      success: res => {
        console.log(res);
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
