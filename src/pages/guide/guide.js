
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  
})
