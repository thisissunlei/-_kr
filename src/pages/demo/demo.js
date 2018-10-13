//获取应用实例
const app = getApp();
import {demoAnimate,demoAnimates} from '../../utils/animate.js';
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
    console.log('onReady---')
    let ii = 0
    let that = this;

    // // 第一个
    // var animationData = wx.createAnimation({
    //   duration: 400, // 默认为400     动画持续时间，单位ms
    //   // timingFunction: 'ease-in-out',
    //   //transformOrigin: '4px 91px'
    // });
    // var animationDataTwo = wx.createAnimation({
    //   duration: 400, // 默认为400     动画持续时间，单位ms
    //   // timingFunction: 'ease-in-out',
    //   //transformOrigin: '4px 91px'
    // });
    // animationData.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });
    // animationDataTwo.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });

    // // 第二个
    // var animationCloudData = wx.createAnimation({
    //   duration: 400, // 默认为400     动画持续时间，单位ms
    //   // duration: 1000, // 默认为400     动画持续时间，单位ms
    //   // timingFunction: 'ease-in-out',
    // });
    // animationCloudData.translateY(-670).step({ duration: 2000 }).translateY(-1340).step({ duration: 2000 }).translateY(0).step({ duration: 100 });
    // this.setData({
    //   // 导出动画示例
    //   animationCloudData: animationCloudData.export(),
    //   animationDataOne: animationData.export(),
    //   animationDataTwo: animationDataTwo.export(),
      
    // },function(){
    //   setTimeout(function(){
        
    //   },4100)
    // })
    this.WXAniamtion()
    
    
    // if(run){
    //   this.james = setTimeout(function () {
        //动画的脚本定义必须每次都重新生成，不能放在循环外
      
        
      //   // 更新数据
      //   that.setData({
      //     // 导出动画示例
      //     animationData: animationData.export(),
      //     animationCloudData: animationCloudData.export(),
      //   })
      //   ++ii;
      //   console.log(ii);

      // }.bind(that),4200);

    // }
  },
  WXAniamtion(){
    let that = this;
    console.log('WXAniamtion')
     var animationData = wx.createAnimation({
      duration: 4100, // 默认为400     动画持续时间，单位ms
      // timingFunction: 'ease-in-out',
      //transformOrigin: '4px 91px'
    });
     var animationDataTwo = wx.createAnimation({
      duration: 400, // 默认为400     动画持续时间，单位ms
      // timingFunction: 'ease-in-out',
      //transformOrigin: '4px 91px'
    });
    // 第二个
    var animationCloudData = wx.createAnimation({
      duration: 4100, // 默认为400     动画持续时间，单位ms
      // duration: 1000, // 默认为400     动画持续时间，单位ms
      // timingFunction: 'ease-in-out',
    });
    let i = 0
    animationData.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });
    animationDataTwo.translateY(-670).step({ duration: 2000 }).translateY(603).step({ duration: 200 }).translateY(0).step({ duration: 1800 });

    animationCloudData.translateY(-670).step({ duration: 2000 }).translateY(-1340).step({ duration: 2000 }).translateY(0).step({ duration: 10 });
    _this.setData({
      animationCloudData: animationCloudData.export(),
      animationDataOne: animationData.export(),
      animationDataTwo: animationDataTwo.export(),
      
    },function(){
       i++ 
      if(_this.run && i<3){

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
    console.log('==========',this.number)
    let one = -(parseInt(this.number.slice(0, 1))*67)
    let two = -(parseInt(this.number.slice(1, 2))*67)
    let oneTime = parseInt(this.number.slice(0, 1))* 200;
    let twoTime = parseInt(this.number.slice(1, 2))* 200;
    console.log(one,twoTime,'endAnimation',two,oneTime)
    var animationData = wx.createAnimation({
      duration: 400, // 默认为400     动画持续时间，单位ms
      // timingFunction: 'ease-in-out',
      //transformOrigin: '4px 91px'
    });
    // 第二个
    var animationCloudData = wx.createAnimation({
      duration: 400, // 默认为400     动画持续时间，单位ms
      // duration: 1000, // 默认为400     动画持续时间，单位ms
      // timingFunction: 'ease-in-out',
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
    this.number = '07'
    this.run = false;
    return;
    console.log('stop',e,e.animationend)
    let that = this;
    var animationCloudData = wx.createAnimation({
      duration: 1000, // 默认为400     动画持续时间，单位ms
      timingFunction: 'ease-in-out',
    });
    animationCloudData.translateY(120).step({ duration: 500 });
    clearInterval(that.james)

    setTimeout(function(){
      that.setData({
        // 导出动画示例
          //animationData: animationData.export(),
          animationCloudData: animationCloudData.export(),
        },function(){
          console.log('结束动画')
        })
    },10000)
        
        
        
  },
  
});
