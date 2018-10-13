//获取应用实例
const app = getApp();
import {demoAnimate,demoAnimates} from '../../utils/numAnimate.js';
// import {demoAnimate,demoAnimates} from '../../utils/animate.js';
let _this 
Page({
  data: {
    numArr:[{label:'0'},{label:'0'}],
    numArrs:[{label:'0'},{label:'0'}],
    number:'520',
    top:0,
    run:true,
    animationDataTwo:'',
    animationDataOne:'',
    animationCloudData:'',
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
  },
  aaa :3445,
  james:'',
  other:'',
  run:true,
  number:'00',
  onLoad: function() {
    _this = this;
    let that = this;
    let numArr = this.data.numArr;
    let numArrs = this.data.numArrs;
  },
  onReady:function(){
    let ii = 0
    let that = this;
    // this.WXAniamtion()
    this.james = new demoAnimates({
      _this:that,
      callback:function(){
        console.log('callback',that.aaa)
      }
    })
    
   
  },
  WXAniamtion(){
    let that = this;
     var animationData = wx.createAnimation({
      duration: 400,
    });
     var animationDataTwo = wx.createAnimation({
      duration: 400, 
    });
    // 第二个
    var animationCloudData = wx.createAnimation({
      duration: 400, 
    });
    animationData.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });
    animationDataTwo.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });

    animationCloudData.translateY(-670).step({ duration: 2000 }).translateY(-1340).step({ duration: 2000 }).translateY(0).step({ duration: 10 });
    _this.setData({
      animationCloudData: animationCloudData.export(),
      animationDataOne: animationData.export(),
      animationDataTwo: animationDataTwo.export(),
      
    },function(){
      if(_this.run){

        _this.james = setTimeout(function () {
          _this.WXAniamtion()
        },4100)
        
      }else{
        _this.james = setTimeout(function () {
          _this.endAnimation()
        },4000)
        
      }
    })

  },
  endAnimation(){
    let one = -(parseInt(this.number.slice(0, 1))*67)
    let two = -(parseInt(this.number.slice(1, 2))*67)
    let oneTime = parseInt(this.number.slice(0, 1))* 200;
    let twoTime = parseInt(this.number.slice(1, 2))* 200;
    var animationData = wx.createAnimation({
      duration: 400, 
    });
    // 第二个
    var animationCloudData = wx.createAnimation({
      duration: 400, 
    });
    animationData.translateY(one).step({ duration: oneTime });
    animationCloudData.translateY(two).step({ duration: twoTime });

    _this.setData({
      animationDataOne: animationData.export(),
      animationDataTwo: animationCloudData.export(),
    })
  },
  moveToBind(){
    console.log('moveToBind======')
    
  },
  stop(e){
     this.james.stop('07')
    // this.number = '07'
  },
  
});
