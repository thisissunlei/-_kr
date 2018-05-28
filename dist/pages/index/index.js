//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    duration: 1000,
    buildingList:[],
    myMeeting:[],
    metting:false
  },
  
  onLoad: function () {
    wx.request({
      url:'https://www.easy-mock.com/mock/5b0958295c37757453191ee5/kr/home',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        "atitude":"39.92",
        "longitude":"116.46"
      },
      success:(res)=>{
        console.log(res)
        this.setData({
          buildingList:res.data.buildingList,
          myMeeting:res.data.myMeeting
        })
        
        if(res.data.myMeeting.length>0){
          this.setData({
            metting:true
          })
        }
      }
    })
  },
  
  //会议滑动
  
})
