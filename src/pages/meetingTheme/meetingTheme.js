
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bindKeyInput:'技术部集体会议'
  },
  bindViewTap(){
    console.log('bindViewTap')
  },
  clearValue(e){
    this.setData({
      bindKeyInput: ''
    })
    console.log('clearValue', this)
  },
  formSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  onLoad: function () {
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})
