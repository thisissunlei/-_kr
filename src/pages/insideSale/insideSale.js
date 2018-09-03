
//获取应用实例
const app = getApp();

Page({
  data: {
    imgUrl:app.globalData.KrImgUrl,
    status:'aa',
    saleList:true,
    ruleModal:false,
  },
  onLoad: function () {
    // this.getSaleList();
    // this.getRecordList();
  },
  getSaleList(){
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/list",
        methods: "GET",
        header: {
          "content-type": "appication/json"
        },
        data: {
          
        },
        success: res => {
          // console.log(res)
          let userInfo = Object.assign({}, res.data.data);
          // console.log(userInfo)
          userInfo.phone = userInfo.phone;
          this.setData({
           
          });
        }
      });
  },
  getRecordList(){
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/krcertificate/certificate/record",
      methods: "GET",
      header: {
        "content-type": "appication/json"
      },
      data: {
        
      },
      success: res => {
        // console.log(res)
        let userInfo = Object.assign({}, res.data.data);
        // console.log(userInfo)
       
        this.setData({
          
        });
      }
    });
  },
  myCatchTouch: function () {
    return;
  },
  modalHide(){
    this.setData({
      ruleModal:!this.data.ruleModal
    })
  },
  goToIndex(){
    wx.navigateTo({
      url: "../index/index"
    });
  },
  goToSale(){
    wx.navigateTo({
      url: "../myCoupon/myCoupon"
    });
  }
 
})
