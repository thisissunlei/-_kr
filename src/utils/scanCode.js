const app = getApp()

const scanCode = function (targetType, targetId, self) {

  wx.scanCode({
    success(res) {
      wx.request({
        url: res.result,
        method: "get",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "accept": "application/json",
        },
        success: (data_new) => {
          console.log('data_new_url', data_new.data.url)
          if (!data_new || !data_new.data || !data_new.data.url || !data_new.data.url.includes('krspace')) {
            wx.showToast({
              title: '无效的二维码',
              icon: 'none',
              duration: 2000
            });
            return;
          }
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
              console.log('openRes', res);
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
        fail() {
          wx.showToast({
            title: '无效的二维码',
            icon: 'none',
            duration: 2000
          });
        }
      })

    },
    fail() {
      wx.showToast({
        title: '无效的二维码',
        icon: 'none',
        duration: 2000
      });
    }
  })

};

module.exports = {
  scanCode
};