//获取应用实例
const app = getApp();
import {animate,animates} from '../../utils/numAnimate.js';
Page({
  data: {
    numArr:[{label:'0'},{label:'0'},{label:'0'}],
    number:'520',
     KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
  },
  onLoad: function() {
    let that = this;
    let numArr = this.data.numArr;
    setTimeout(function(){
      animates(numArr,that)
    },1000)
  },
  
});
