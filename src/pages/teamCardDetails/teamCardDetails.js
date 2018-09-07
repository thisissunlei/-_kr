const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    card: true,
    checked: false,
    name: "",
    changeNametext: "",
    nameShow: false,
    tip: "",
    info: {},
    price: null
  },
  cardId: null,
  onLoad(options) {
    this.cardId = options.cardId;
    this.getTeamCardDetail();
  },
  getTeamCardDetail() {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/detail",
      methods: "GET",
      data: {
        cardId: this.cardId
      },
      success: res => {
        res.data.data.remainAmount = res.data.data.remainAmount
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
        res.data.data.faceValue = res.data.data.faceValue
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
        res.data.data.cost = res.data.data.cost
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
        res.data.data.effectAt = this.setTime(res.data.data.effectAt, "card");
        res.data.data.expireAt = this.setTime(res.data.data.expireAt, "card");
        if (!!res.data.data.usetotal && !!res.data.data.lastUseTime) {
          res.data.data.lastUseTime = this.setTime(
            res.data.data.lastUseTime,
            "last"
          );
        }
        res.data.data.orderTime = this.setTime(res.data.data.orderTime, "last");
        this.setData({
          checked: res.data.data.remind,
          name: res.data.data.cardName,
          info: res.data.data
        });
      },
      fail: res => {}
    });
  },
  turnCardToAfter() {
    this.setData({
      card: false
    });
  },
  turnCardToBefore() {
    this.setData({
      card: true
    });
  },
  switchChange(e) {
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/changeremind",
      method: "POST",
      data: {
        cardId: this.cardId
      },
      success: res => {
        this.setData({
          checked: e.detail.value
        });
      },
      fail: res => {}
    });
  },
  toRecordList() {
    wx.navigateTo({
      url: "../teamCardRecord/teamCardRecord?cardId=" + this.cardId
    })
  },
  toPersonList() {
    wx.navigateTo({
      url: "../teamCardManage/teamCardManage?cardId=" + this.cardId
    });
  },
  changeName() {
    this.setData({
      nameShow: true,
      changeNametext: this.data.name
    });
  },
  cancel() {
    this.setData({
      nameShow: false,
      changeNametext: ""
    });
  },
  sure() {
    if (!!this.data.changeNametext.trim()) {
      app.getRequest({
        url:
          app.globalData.KrUrl +
          "api/gateway/kmteamcard/teamcard/updatecardname",
        method: "POST",
        data: {
          cardId: this.cardId,
          cardName: this.data.changeNametext
        },
        success: res => {
          this.setData({
            nameShow: false,
            name: this.data.changeNametext
          });
        },
        fail: res => {}
      });
    } else {
      this.setData({
        tip: "请填写团队卡名称～"
      });
      setTimeout(() => {
        this.setData({
          tip: ""
        });
      }, 2000);
    }
  },
  bindKeyInput(e) {
    this.setData({
      changeNametext: e.detail.value
    });
  },
  setTime(time, state) {
    var y, M, d, h, m, s;
    y = new Date(parseInt(time)).getFullYear();
    M =
      new Date(parseInt(time)).getMonth() + 1 >= 10
        ? new Date(parseInt(time)).getMonth() + 1
        : "0" + (new Date(parseInt(time)).getMonth() + 1);
    d =
      new Date(parseInt(time)).getDate() >= 10
        ? new Date(parseInt(time)).getDate()
        : "0" + new Date(parseInt(time)).getDate();

    h =
      new Date(parseInt(time)).getHours() >= 10
        ? new Date(parseInt(time)).getHours()
        : "0" + new Date(parseInt(time)).getHours();
    m =
      new Date(parseInt(time)).getMinutes() >= 10
        ? new Date(parseInt(time)).getMinutes()
        : "0" + new Date(parseInt(time)).getMinutes();
    s =
      new Date(parseInt(time)).getSeconds() >= 10
        ? new Date(parseInt(time)).getSeconds()
        : "0" + new Date(parseInt(time)).getSeconds();
    if (state === "card") {
      return y + "." + M + "." + d;
    } else {
      return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
    }
  }
});
