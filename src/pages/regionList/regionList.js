
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeTab:'',
    item:'item',
    active:'active item',
    value:'',
    cityList:[
      {
        city:'中国',
        code:'86'
      },
      {
        city:'中国香港',
        code:'852'
      },
      {
        city:'中国澳门',
        code:'853'
      },
      {
        city:'中国台湾',
        code:'886'
      },
      {
        city:'澳大利亚',
        code:'61'
      },
      {
        city:'韩国',
        code:'82'
      },
      {
        city:'加拿大',
        code:'1'
      },
      {
        city:'马来西亚',
        code:'60'
      },
      {
        city:'美国',
        code:'60'
      },
      {
        city:'日本',
        code:'81'
      },
      {
        city:'新加坡',
        code:'65'
      },
      {
        city:'英国',
        code:'44'
      },
      

    ]
  },
  fun:'',
   button_boolean:true,
  onLoad: function (options) {
    console.log('options.value',options.value)
    this.fun = options.fun;
    this.setData({
      activeTab: options.value
    })
  },
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  checkWarn:function(e){;
    var target = e.target.dataset;
    console.log(target,'checkWarn',target.city)
    console.log(target,'checkWarn',target.name)
    let that = this;
    if(this.button_boolean){
      that.button_boolean = false;
      this.setData({
        activeTab:target.name,
        value:target.city
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../bindPhone/bindPhone?city='+target.city+'&fun='+that.fun,
          success:function(){
            that.button_boolean = true;
          }
        });
        

      },200)
    }
    
  }
})
