const app = getApp()

const scanCode = function (targetType, targetId, self) {

  wx.scanCode({
    success(res) {
      // self.setData({
      //   password: '3454',
      //   passwordDialog: true
      // })
      wx.request({
        url: res.result,
        method: "get",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "accept": "application/json",
        },
        success: (data_new) => {
          let url = app.globalData.KrUrl + "api/gateway/kmqrcode/km-open-door?" + data_new.data.url.split('?')[1] + '&targetType=' + targetType + '&targetId=' + targetId;
          wx.request({
            url: url,
            method: "get",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              "accept": "application/json",
              Cookie: app.globalData.Cookie
            },
            success: (res) => {
              if (res.code === 0) {
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 2000
                })

              } else if (res.code === -2) {
                self.setData({
                  phoneDialog: true
                })
              } else if (res.code === -3) {
                self.setData({
                  password: res.data.message,
                  passwordDialog: true
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        },
      })
    }
  })

};

module.exports = {
  scanCode
};