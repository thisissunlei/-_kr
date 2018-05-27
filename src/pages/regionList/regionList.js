
import * as CAlculagraph from '../../utils/time.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeTab:'',
    item:'item',
    active:'active item',
    cityList:[
      {
        city:'中国',
        code:'+86'
      },
      {
        city:'中国香港',
        code:'+852'
      },
      {
        city:'中国澳门',
        code:'+853'
      },
      {
        city:'中国台湾',
        code:'+886'
      },
      {
        city:'澳大利亚',
        code:'+61'
      },
      {
        city:'韩国',
        code:'+82'
      },
      {
        city:'加拿大',
        code:'+1'
      },
      {
        city:'马来西亚',
        code:'+60'
      },
      {
        city:'美国',
        code:'+60'
      },
      {
        city:'日本',
        code:'+81'
      },
      {
        city:'新加坡',
        code:'+65'
      },
      {
        city:'英国',
        code:'+44'
      },
      

    ]
  },
  onLoad: function (options) {
    console.log('options.value',options.value)
    this.setData({
      activeTab: options.value
    })
  },
  checkWarn:function(e){;
    var target = e.target.dataset;
    console.log(target,'checkWarn',target.city)
    this.setData({
      activeTab:target.city
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '../bindPhone/bindPhone?city='+target.city
      });
    },500)
  }
})
