const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    leader: null, //是否为管理员
    flag: false,
    showDel: false,
    manageList: [
      {
        avatarUrl:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        nickName: "胡一天",
        phone: "18100000001",
        ctime: "2018-08-16 14:23:56",
        checked: false,
        cardId: 1, //卡id
        id: 110, //持卡人id
        leader: false //管理员
      },
      {
        avatarUrl:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        nickName: "蔡徐坤",
        phone: "18100000001",
        ctime: "2018-08-16 14:23:56",
        checked: false,
        cardId: 1, //卡id
        id: 110, //持卡人id
        leader: true //管理员
      }
    ]
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      console.log("来自页面赠送按钮");
      console.log(res);
      return {
        title: "嗨～，这张卡给你用，想花就花超便捷！",
        path:
          "pages/activityDetails/activity?activityId=" +
          this.data.manageList[0].cardId,
        imageUrl: this.data.info.sharePic
      };
    } else {
      console.log("来自右上角转发菜单");
      return app.globalData.share_data;
    }
  },
  onLoad: function(options) {
    this.getHolderList();
  },
  //点击删除用卡人
  delPeople: function() {
    this.setData({
      flag: true,
      showDel: true
    });
  },
  //用卡人管理接口
  getHolderList: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/holderlist",
      data: {
        cardId: 1
      },
      success: res => {
        console.log(res.data.data);
        let manageList = res.data.data.items;
        manageList.map(item => {
          item.ctime = that.toDate(item.ctime);
          return item;
        });
        that.setData({
          manageList: manageList,
          leader: res.data.data.leader
        });
      }
    });
  },
  //点击取消
  cancel: function() {
    this.setData({
      flag: false,
      showDel: false
    });
  },
  //选择删除的用卡人
  checkedPeople: function(e) {
    // console.log(e.currentTarget.dataset.index);
    // console.log(e.currentTarget.dataset.info);
    var that = this;
    var arr = that.data.manageList;
    arr[e.currentTarget.dataset.index].checked = !arr[
      e.currentTarget.dataset.index
    ].checked;
    that.setData({
      manageList: arr
    });
    // console.log(that.data.manageList);
  },
  //时间戳格式化
  toDate: function(number) {
    var date = new Date(number);
    var Y = date.getFullYear() + "-";
    var M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1) + "-"
        : date.getMonth() + 1 + "-";
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var H =
      date.getHours() < 10
        ? "0" + date.getHours() + ":"
        : date.getHours() + ":";
    var m =
      date.getMinutes() < 10
        ? "0" + date.getMinutes() + ":"
        : date.getMinutes() + ":";
    var S =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + " " + H + m + S;
  }
});
