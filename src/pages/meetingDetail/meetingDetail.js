//index.js
//获取应用实例
var QR = require("../../utils/qrcode.js");

const app = getApp()

Page({
  data: {
    conferee:[
      {
        'name':'刘佳佳'
      },
      {
        'name':'molly'
      },
      {
        'name':'谭烨'
      },
      {
        'name':'沈美美'
      },
      {
        'name':'段郝耀'
      },
      {
        'name':'蒋萌'
      }
    ],
    hint:[
      {
        'title':'到了如何使用会议室？',
        'text':'您到现场出示二维码认证成功后，运营人员会帮您打开会议室门哦~'
      },
      {
        'title':'到了如何到了使用到了会议室？',
        'text':'您到现场出示二维码认证成功后，运营人员会帮您打开会议室门哦~'
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log('options',options)
    this.createQrCode('fdfd',"mycanvas",100,200);
  },
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);
    var that = this;
  },
   onShareAppMessage: function (res) {
    console.log(res,8888)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题111',
      path: '/page/user?id=123'
    }
  }
})
