const app = getApp()
Page({
    data: {
        assistance:{},
        btn_bool:true,
        user_info:''
    },
    onLoad(options) {
      let that = this;
    },
    // 下拉刷新
    onPullDownRefresh(e) {
        
    },
    // 上拉加载
    onReachBottom() {
      
    },
    //获取用户信息
    getInfo: function() {
      var that = this;
      wx.getUserInfo({
        success: function(res) {
          // that.setData({
          //   avatarUrl: res.userInfo.avatarUrl
          // });
          //保存到storage里
          console.log(res)
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
            success: res => {}
          });
          that.getAssistance();
        }
      });
    },  
  //助力详情
  
  getAssistance: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/booster",
      method:'POST',
      data: {
        firstCustomer: true,
        id: 1384
      },
      success: res => {}
    });
  },
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
        this.getInfo();
        this.setData({
          btn_bool: false
        });
    }
  }
})