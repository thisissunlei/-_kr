const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    leader: null, //是否为管理员
    checkeMember: false, //选择删除的成员开关
    showDel: false, //底部按钮切换
    manageList: [],
    showConfirm: true,
    checkedPeo: []
  },
  cardId: null,
  shareKey: "",
  page: 1,
  pageSize: 10,
  totalPages: 1,
  holderIds: [],
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === "button") {
      return {
        title: "嗨～，这张卡给你用，想花就花超便捷！",
        path:
          "pages/getTeamCard/getTeamCard?cardId=" +
          that.cardId +
          "&shareKey=" +
          that.shareKey,
        imageUrl: "../images/orderimg/share.png"
      };
    } else {
      return app.globalData.share_data;
    }
  },
  onLoad: function(options) {
    this.cardId = options.cardId;
    this.getHolderList();
    this.shareInfo();
  },
  onShow: function() {
    // let that = this;
    // if (that.data.manageList.length > 1) {
    //   that.setData({
    //     showConfirm: false
    //   });
    // } else {
    //   that.setData({
    //     showConfirm: true
    //   });
    // }
  },
  toLower: function(e) {
    var that = this;
    // console.log(e.detail.direction);
    if (e.detail.direction == "bottom") {
      if (that.page == that.totalPages) {
        // console.log(1);
        return;
      } else {
        that.page = that.page + 1;
        app.getRequest({
          url:
            app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/holderlist",
          data: {
            cardId: that.cardId,
            page: that.page,
            pageSize: that.pageSize
          },
          success: res => {
            let manageList = res.data.data.items;
            manageList.map(item => {
              item.ctime = that.toDate(item.ctime);
              return item;
            });
            that.setData({
              manageList: [].concat(that.data.manageList, manageList)
            });
          }
        });
      }
    }
  },
  //团队卡数据接口
  shareInfo: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/sharecard",
      data: {
        cardId: that.cardId
      },
      success: res => {
        that.shareKey = res.data.data.shareKey;
      }
    });
  },
  //点击删除用卡人
  delPeople: function() {
    this.setData({
      checkeMember: true,
      showDel: true
    });
  },
  //确认删除用卡人
  confirmDel: function() {
    let that = this;
    let holder = [];
    let infoList = that.data.manageList;
    infoList.map(item => {
      if (item.checked) {
        holder.push(item.id);
      }
      return item;
    });
    // console.log(holder);
    that.holderIds = holder;
    if (that.holderIds.length == 0) {
      return;
    } else {
      app.getRequest({
        url:
          app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/deleteholder",
        method: "post",
        data: {
          cardId: that.cardId,
          holderIds: that.holderIds.join(",")
        },
        success: res => {
          wx.showToast({
            title: "删除成功",
            image: "../images/public/success.png",
            duration: 1500
          });
          console.log(res);
          that.getHolderList();
          that.setData({
            checkeMember: false,
            showDel: false
          });
        }
      });
    }
  },
  //用卡人管理接口
  getHolderList: function() {
    let that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/holderlist",
      data: {
        cardId: that.cardId,
        page: that.page,
        pageSize: that.pageSize
      },
      success: res => {
        console.log(res);
        that.totalPages = res.data.data.totalPages;

        let manageList = res.data.data.items;
        manageList.map(item => {
          item.ctime = that.toDate(item.ctime);
          return item;
        });
        that.setData({
          manageList: manageList,
          leader: res.data.data.leader
        });
        if (manageList.length > 1) {
          that.setData({
            showConfirm: false
          });
        } else {
          that.setData({
            showConfirm: true
          });
        }
      }
    });
  },
  //点击取消
  cancel: function() {
    let newManage = this.data.manageList;
    newManage.map(item => {
      item.checked = false;
      return item;
    });
    this.setData({
      manageList: newManage,
      checkeMember: false,
      showDel: false
    });
  },
  //选择删除的用卡人
  checkedPeople: function(e) {
    let that = this;
    let checkedPeo = [];
    let newManage = that.data.manageList;
    newManage[e.currentTarget.dataset.index].checked = !newManage[
      e.currentTarget.dataset.index
    ].checked;
    that.setData({
      manageList: newManage
    });
    newManage.map(item => {
      if (item.checked) {
        checkedPeo.push(item);
      }
    });
    that.setData({
      checkedPeo: checkedPeo
    });
    // console.log(that.data.checkedPeo);
    // let result = newManage.some(item => {
    //   return item.checked;
    // });
    // if (result) {
    //   that.setData({
    //     showConfirm: false
    //   });
    // } else {
    //   that.setData({
    //     showConfirm: true
    //   });
    // }
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
    var H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var S =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + "-" + M + "-" + D + " " + H + ":" + m + ":" + S;
  }
});
