//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    console.log('onLoad=======')
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  jumpView(e){
    var target = e.target.dataset;
    var type = target.type;
    console.log(target,'checkWarn',target.type)
    let url = ''
    switch (type){
      case 'phone':
        url = "../bindPhone/bindPhone?value=绑定数据"
        break;
      case 'telephone':
        url = "../phone/phone?value=联系电话"
        break;
      case 'warn':
        url = "../warn/warn?value=warn"
        break;
      default:
        url = "../meetingTheme/meetingTheme?value=meetingTheme"
        break;
    } 
    wx.navigateTo({
      url: url
    });
  }
})
