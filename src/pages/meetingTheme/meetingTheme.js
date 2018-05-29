
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   inputValue:''
  },
  bindViewTap(){
    console.log('bindViewTap')
  },
  bindKeyInput:function(e){
    let value = e.detail.value;
    this.setData({
      inputValue: e.detail.value,
      inputValues: e.detail.value
    })
  },
  clearValue(e){
    this.setData({
      inputValue: ''
    })
    console.log('clearValue', this)
  },
  formSubmit(e){
    console.log('form发生了submit事件，携带数据为：', this.data.inputValue)
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'lat_log',
      success: function(res) {
          console.log('===',res.data)
      } 
    })
    this.setData({
      inputValue:options.value
    })
  },
})
