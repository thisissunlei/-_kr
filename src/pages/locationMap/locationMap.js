//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    latitude: 0,
    longitude: 0,
    scale: 18,
  },
  
  onLoad: function() {
    var that = this;
   
    wx.getLocation({
      type: "gcj02",
      success: res => {
        console.log('res---',res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers:[
            {
              iconPath: "../images/map/mark.png",
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 26,
              height: 35
            }
          ]
        });
       
      }
    });
  },
  
  onReady: function() {
    this.mapCtx = wx.createMapContext("locationMap",this);
    
    
  },
 
  
  
});
