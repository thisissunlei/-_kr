//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    buildingList:[],
    myMeeting:[],
    address:'',
    meetingRoomName:'',
    meetingTime:'',
    theme:'',
    buildAddress:'',
    buildImgUrl:'',
    buildName:'',
    distance:'',
    distance:'',
    promotionDescr:''
  },
  
  onLoad: function () {
    wx.request({
      url:'api/gateway/krmting/home',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        "atitude":"39.92",
        "longitude":"116.46"
      },
      success:(res)=>{
        cosole.log(res)
        this.setData({
          address:res.data.myMeeting.address,
          meetingRoomName:res.data.myMeeting.meetingRoomName,
          meetingTime:res.data.myMeeting.meetingTime,
          theme:res.data.myMeeting.theme,
          buildAddress:res.data.buildingList.buildAddress,
          buildImgUrl:res.data.buildingList.buildImgUrl,
          buildName:res.data.buildingList.buildName,
          // communityId:res.data.buildingList.communityId,
          distance:res.data.buildingList.distance,
          meetingCount:res.data.buildingList.meetingCount,
          promotionDescr:res.data.buildingList.promotionDescr,
        })
      }
    })
  },
  
})
