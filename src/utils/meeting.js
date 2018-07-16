const app = getApp()
var QR = require("qrcode.js");

var meetingData = function(inviteeId,callback,that){   
 
  app.getRequest({
    url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
    methods:"GET",
    header:{
      "content-type":"application/json"
    },
    data:{
      inviteeId:inviteeId
    },
    success:(res)=>{
      setTimeout(function(){
        wx.hideLoading();
      },2000)
      console.log(res,"会议详情")
      let data = res.data.data
      let meetingDetailData = Object.assign({},data)
      let inviteers = res.data.data.inviteers
      let meetingObj={
        meetingDetailData:meetingDetailData,
        inviteers:inviteers
      }
      callback(meetingObj);
    }
  })
    
}

var cancelMeeting = function(inviteeId,inviteers,that){
  wx.showModal({
    title: '提示',
    content: '取消参会后，会议开始前您可以从我的订单或会议邀请中，再次参加会议哦～',
    cancelText:'暂不取消',
    confirmText:'无情走开',
    confirmColor:'#F5A623',
    success: function(res) {
      if (res.confirm) {
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/invitee/cancel',
          methods:"GET",
          header:{
            "content-type":"application/json"
          },
          data:{
            inviteeId:inviteeId
          },
          success:(res)=>{
            console.log(res,"取消参会")

            wx.getStorage({
              key: 'user_info',
              success:(res)=>{
                inviteers.forEach((item,index)=>{ 
                  if(item.wechatAvatar === res.data.user_info.avatarUrl && item.wechatNick === res.data.user_info.nickName){
                    // that.data.meetingDetailData.inviteers.splice(index, 1)
                    inviteers.splice(index,1)
                  }    
                })
                that.setData({
                  // meetingDetailData: that.data.meetingDetailData,
                  inviteers:inviteers
                })
              },
            })
            
          }
        })
        wx.reLaunch({
          url:"../index/index"
        })
      } else if (res.cancel) {
        
      }
    }
  })
}
module.exports = {
    meetingData:meetingData,
    cancelMeeting:cancelMeeting
}