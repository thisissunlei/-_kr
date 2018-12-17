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
          let url = app.globalData.KrUrl + "api/gateway/wx/qrcode/wx-open-door" + data_new.data.url.split('?')[1];
          wx.request({
            url: url,
            method: "get",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              "accept": "application/json",
            },
            success: (res) => {
              if (res.code === 0) {
                debugger;
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
                  password: res.data.code,
                  passwordDialog: true
                })
              } else {
                wx.showToast({
                  title: res.message,
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