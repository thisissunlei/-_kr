//获取应用实例
const app = getApp();
import {demoAnimate,demoAnimates,Animates} from '../../utils/numAnimate.js';
// import {demoAnimate,demoAnimates} from '../../utils/animate.js';
let _this 
Page({
  data: {
    numArr:[{label:'0'},{label:'0'}],
    numArrs:[{label:'0'},{label:'0'}],
    number:'520',
    top:0,
    run:false,
    animationDataTwo:'',
    animationDataOne:'',
    animationCloudData:'',
    animationDataThree:'',
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    show:true,
    animationTwo:'',
    animationOne:'',
    show:false,
    initOne:'one',
        initOnes:'one',
        initTwo:'two',
        initTwos:'two',
  },
  aaa :3445,
  james:'',
  other:'',
  
  number:'00',
  onLoad: function() {
    let that = this;
  },
  onReady:function(){
    let ii = 0
    let that = this;
    this.james = new demoAnimate({
      _this:this
    })
    // this.WXAniamtion()
    // this.james = new Animates({
    //   _this:that,
    //   callback:function(){
    //     console.log('callback',that.aaa)
    //   }
    // })

    // setTimeout(function(){
    //       that.setData({
    //         initTwos:"two two-animation delay",
    //         initTwo:'two two-animation',
    //         initOnes:'one one-animation delay',
    //         initOne:'one one-animation'
    //       })
    //     },1500)
    
    
    
   
  },
  initNum(num){
    if(parseInt(num) == 0){
      return;
    }
    let one = parseInt(num.slice(0, 1));
    let two = parseInt(num.slice(1, 2));
    let three = parseInt(num.slice(2, 3));
    let one_y,two_y,three_y,one_time,two_time,three_time; 
    if(one == 0){
      one_y = -670;
    }else{
      one_y = -(67*one)
    }
    if(two == 0){
      two_y = -670;
    }else{
      two_y = -(67*two)
    }
    if(three == 0){
      three_y = -670;
    }else{
      three_y = -(67*three)
    }
    console.log('inirNum',one_y,two_y,three_y)
    var animationDataOne = wx.createAnimation({
      duration: 400,
    });
     var animationDataTwo = wx.createAnimation({
      duration: 400, 
    });
    // 第二个
    var animationDataThree = wx.createAnimation({
      duration: 400, 
    });
    animationDataOne.translateY(one_y).step({ duration: one_time });
    animationDataTwo.translateY(two_y).step({ duration: two_time });
    animationDataThree.translateY(three_y).step({ duration: three_time });
    this.setData({
      animationDataOne: animationDataOne.export(),
      animationDataTwo: animationDataTwo.export(),
      animationDataThree:animationDataThree.export()
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
    let that= this
    // this.setData({
    //   run:true,
    // })
    // setTimeout(function(){
    //   that.setData({
    //     one:'one one-animation',
    //     two:'two two-animation'
    //   })
    // },500)
    if(this.run){
      this.james.initNum('000')
      this.run  = false
    }else{
      this.james.initNum('789')
      this.run = true
    }
    console.log('stop=====')
     // this.james.initNum('999')
    // this.number = '07'
  },
  
});
