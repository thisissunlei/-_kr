//获取应用实例
const app = getApp();
import {animate,animates,stop} from '../../utils/numAnimate.js';
import {demoAnimate,demoAnimates} from '../../utils/animate.js';

Page({
  data: {
    numArr:[{label:'0'},{label:'0'}],
    numArrs:[{label:'0'},{label:'0'}],
    number:'520',
     KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
  },
  aaa :3445,
  james:'',
  other:'',
  onLoad: function() {
    let that = this;
    let numArr = this.data.numArr;
    let numArrs = this.data.numArrs;
    this.james = new demoAnimates({
          numArr:numArr,
          _this:that,
          callback:function(that){console.log('ok',that,that.aaa)}
        });
    // setTimeout(function(){
    //   // animate(numArr,'52',that)
    //   // animates(numArr,that,function(that){console.log('ok',that,that.aaa)})
    // },1000)
  },
  moveToBind(){
    let that = this;
    console.log('===========')
    this.james.stop('59')
  },
  dddd(){
    console.log('结束yiqie')
  }
  
});
