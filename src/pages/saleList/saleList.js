//获取应用实例
const app = getApp();
Page({
  data: {
    saleList:[
      {
        id:1,
        name:'11111',
        reduce:'50',
      },
      {
        id:2,
        name:'122111',
        reduce:'30',
      },
    ]
  },
  onLoad: function (options) {
      console.log('saleList--->',options.from)
  },
  notUse:function(){
    wx.setStorage({
        key:"seat_order-sale",
        data:{sale:false},
        success:function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
          
        }
      })
  },
  selectTab:function(e){
    var target = e.target.dataset;
    console.log('selectTab',target.content)
    let obj = target.content;
    obj.sale = true;
    wx.setStorage({
        key:"seat_order-sale",
        data:obj,
        success:function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
          
        }
      })
  }
});
