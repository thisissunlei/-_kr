
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue:'',
    inputValues:''
  },
  bindViewTap(){
    console.log('bindViewTap')
  },
  clearValue(e){
    this.setData({
      inputValue: '',
      inputValues: ''
    })
    console.log('clearValue', this)
  },
  bindKeyInput:function(e){
    let value = e.detail.value;
    this.setData({
      inputValue: e.detail.value,
      inputValues: e.detail.value
    })
  },
  formSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  onLoad: function () {
  },
})
