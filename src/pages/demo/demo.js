//获取应用实例
const app = getApp();
import {animate,animates,stop} from '../../utils/numAnimate.js';
Page({
  data: {
    numArr:[{label:'0'},{label:'0'}],
    numArrs:[{label:'0'},{label:'0'}],
    number:'520',
     KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
  },
  onLoad: function() {
    let that = this;
    let numArr = this.data.numArr;
    let numArrs = this.data.numArrs;
    setTimeout(function(){
      // animate(numArr,'523',that)
      animates(numArr,that)
    },1000)
  },
  moveToBind(){
    stop('59')
  }
  
});
