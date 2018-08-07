//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    latitude: '39.9219',
    longitude: '116.44355',
    scale: 18,
    markers:[
      {
        iconPath: "../images/map/mark.png",
        id: 1,
        latitude: '39.9219',
        longitude: '116.44355',
        width: 26,
        height: 35
      }
    ]
  },
  
  onLoad: function() {
    var _this = this;
   
    // wx.getStorage({
    //   key:'mapOptions',
    //   success:function(res){
    //     let data=res.data
    //     if(data){
    //       _this.setData({
    //         longitude: data.longitude,
    //         latitude: data.latitude,
    //         markers:[
    //           {
    //             iconPath: "../images/map/mark.png",
    //             id: 1,
    //             latitude: data.latitude,
    //             longitude: data.longitude,
    //             width: 26,
    //             height: 35
    //           }
    //         ]
    //       });
    //     }
    //   }
    // })
   
  },
  
  onReady: function() {
    this.mapCtx = wx.createMapContext("locationMap",this);
    
    
  },
 
  
  
});
