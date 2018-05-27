
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue:'技术部集体会议'
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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  onLoad: function () {
  },
})
