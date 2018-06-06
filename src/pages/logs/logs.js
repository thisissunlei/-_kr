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
    wx.setStorage({
      key:"order_pay",
      data:{
        phone:'111',
        title:'会议',
        warn:'NOALERT'
      }
    })
  },
  jumpSubmit(e){
    var target = e.target.dataset;
    var type = target.type;
    console.log(target,'checkWarn',target.type)
    let url = ''
    switch (type){
      case 'telephone':
        url = "../meetingStatus/meetingStatus?inviteeId=202"
        break;
      case 'warn':
        url = "../warn/warn?type=submit&value=NOALERT"
        break;
      default:
        url = "../meetingTheme/meetingTheme?type=submit&value=会议"
        break;
    } 
    wx.navigateTo({
      url: url
    });
  },
  jumpStorage(e){
    var target = e.target.dataset;
    var type = target.type;
    console.log(target,'checkWarn',target.type)
    let url = ''
    switch (type){
      case 'telephone':
        url = "../phone/phone?type=storage"
        break;
      case 'warn':
        url = "../warn/warn?type=storage"
        break;
      default:
        url = "../meetingTheme/meetingTheme?type=storage"
        break;
    } 
    wx.navigateTo({
      url: url
    });
  }
})
