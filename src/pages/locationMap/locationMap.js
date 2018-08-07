//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    latitude: '39.9219',
    longitude: '116.44355',
    scale: 18,
    site:'',
    address:''
  },
  
  onLoad: function() {
    var _this = this;
   
    wx.getStorage({
      key:'mapOptions',
      success:function(res){
        let data=res.data
        if(data){
          _this.setData({
            longitude: data.longtitude,
            latitude: data.latitude,
            site:data.site,
            address:data.address,
            markers:[
              {
                iconPath: "../images/map/mark.png",
                id: 1,
                latitude: data.latitude,
                longitude: data.longtitude,
                width: 26,
                height: 35
              }
            ]
          });
        }
      }
    })
   
  },
  
  onReady: function() {
    this.mapCtx = wx.createMapContext("locationMap",this);
    
    
  },
 
  
  
});
