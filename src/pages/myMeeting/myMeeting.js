//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    meetingList:[
      {
        meetingTime:'11-29 (周三)  19:00-10:30',
        themeName:'测试内容测试内容测试内容测试试',
        meetingRoomName:'测试内容u19h',
        address:'测试内容u19h',
        status:1,
        id:13760
      },
      {
        meetingTime:'11-29 (周三)  19:00-10:30',
        themeName:'测试内容测试内容测试内容测试试',
        meetingRoomName:'测试内容u19h',
        address:'测试内容u19h',
        status:1,
        id:13760
      },
      {
        meetingTime:'11-29 (周三)  9:00-10:30',
        themeName:'测试内容u19h',
        meetingRoomName:'测试内容测试内容测试内容测试试测试内容测试内容123',
        address:'测试内容u19h',
        status:2,
        id:13761
      },
      {
        meetingTime:'11-29 (周三)  9:00-10:30',
        themeName:'测试内容u19h',
        meetingRoomName:'测试内容u19h',
        address:'测试内容u19h',
        status:3,
        id:13762
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/invitee/list',
        methods:"GET",
        data:{
          
        },
        success:(res)=>{
          console.log(res)
          // that.setData({
          //   meetingList:res.data
          // })
        },
        fail:(res)=>{
           console.log('========',res)
        }
      })
  },
})
