
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeTab:'NOALERT',
    item:'item',
    active:'active item'
  },
  onLoad: function (options) {
    this.setData({
      activeTab: options.value || 'NOALERT'
    })
  },
  checkWarn(e){;
    let that = this;
    var target = e.target.dataset;
    console.log(target,'checkWarn',target.code)
    this.setData({
      activeTab:target.code
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '../logs/logs?warn='+that.data.activeTab
      });
    },500)
  }
})
