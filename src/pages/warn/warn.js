
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeTab:'1',
    item:'item',
    active:'active item'
  },
  checkWarn(e){;
    var target = e.target.dataset;
    console.log(target,'checkWarn',target.hi)
    this.setData({
      activeTab:target.hi
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '../meetingTheme/meetingTheme'
      });
    },500)
  }
})
