//index.js
// 获取应用实例
var QR = require("../../utils/qrcode.js");
var meetingData = require("../../utils/meeting.js");
const scanCode = require("../../utils/scanCode");
const app = getApp();

Page({
  onShareAppMessage: function() {
    return app.globalData.share_data;
  },
  data: {
    KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    meetingDetailData: {},
    inviteers: [],
    hint: [
      {
        title: "1. 我订了会议室，要提前多久入场呀？",
        text:
          "会议室使用时间前10分钟可以进入大厅哦，如果订的会议室没有人就可以提前进入啦～"
      },
      {
        title: "2. 到了KrMeeting，怎么入场呀？",
        text:
          "出示入场二维码（在小程序的“我的会议”里），保安小哥哥验证后就可以入场啦～"
      },
      {
        title: "3. 可以订一个小一点的会议室、多一些人入场吗？",
        text: "入场人数不能超过所订会议室的可容纳人数哦！！"
      },
      {
        title: "4. 我订的会议室被别人占用怎么办？",
        text: "前台小姐姐会在会议开始前协调，保证亲的会议顺利开始，不用担心呢～"
      },
      {
        title: "5. 水吧台的茶饮和咖啡看起来好赞，取用需要付费吗？",
        text: "都是免费的、而且不限量哦，自助取用就可以啦～"
      },
      {
        title: "6. 会议室的无线投屏设备好先进，使用需要额外付费吗？",
        text:
          "也是免费的哦，找前台小姐姐登记领取就可以啦（使用方法见会议桌上的提示卡，很简单呢），离开时记得归还哦~"
      },
      {
        title: "7. 订的使用时段结束了，会还没开完怎么办呢？",
        text: "可以在KrMeeting小程序续订哦～"
      },
      {
        title: "8. 大厅环境太好了，开完会想多待会儿可以吗？",
        text:
          "所订时段结束后的10分钟内可以在大厅休整啦，之后前台小姐姐会依依不舍的送亲离开哦！"
      }
    ],
    phoneDialog: false,
    passwordDialog: false,
    password: ''
  },
  inviteeId: "",
  status: "",
  onLoad: function(options) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    console.log(options, "options");
    if (options.status) {
      this.inviteeId = options.inviteeId;
      this.status = options.status;
    } else {
      this.inviteeId = options.inviteeId;
    }
    //数据加载
    var _this = this;
    meetingData.meetingData(
      this.inviteeId,
      function(meetingObj) {
        _this.setData({
          meetingDetailData: meetingObj.meetingDetailData,
          inviteers: meetingObj.inviteers
        });
        // if (_this.data.meetingDetailData.meetingStatus === "EXPIRED") {
        //   QR.qrApi.draw(
        //     "https://web.krspace.cn/kr-meeting/kr_meeting_h5/index.html?inviteeId=" +
        //       _this.inviteeId,
        //     "mycanvas",
        //     160,
        //     160,
        //     null,
        //     "rgba(0,0,0,0.3)"
        //   );
        // } else {
        //   QR.qrApi.draw(
        //     "https://web.krspace.cn/kr-meeting/kr_meeting_h5/index.html?inviteeId=" +
        //       _this.inviteeId,
        //     "mycanvas",
        //     160,
        //     160
        //   );
        // }
        // if (_this.data.meetingDetailData.meetingStatus === 'EXPIRED') {
        //   QR.qrApi.draw("http://cdntest01.krspace.cn/kr_meeting/index.html?inviteeId=" + _this.inviteeId, "mycanvas", 150, 150, null, "rgba(0,0,0,0.6)");
        // } else {
        //   QR.qrApi.draw("http://cdntest01.krspace.cn/kr_meeting/index.html?inviteeId=" + _this.inviteeId, "mycanvas", 150, 150);
        // }
      },
      this
    );

    // app.getRequest({
    //   url:app.globalData.KrUrl+'api/gateway/krmting/invitee/detail',
    //   methods:"GET",
    //   header:{
    //     "content-type":"application/json"
    //   },
    //   data:{
    //     inviteeId:this.inviteeId
    //   },
    //   success:(res)=>{
    //     setTimeout(function(){
    //       wx.hideLoading();
    //     },2000)
    //     console.log(res,"会议详情")
    //     let data = res.data.data
    //     let meetingDetailData = Object.assign({},data)
    //     console.log(meetingDetailData)
    //     this.setData({
    //       meetingDetailData:meetingDetailData,
    //       inviteers:res.data.data.inviteers,
    //     })
    // if(res.data.data.meetingStatus==='EXPIRED'){
    //   QR.qrApi.draw('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.inviteeId,"mycanvas",150,150,null,'rgba(0,0,0,0.6)');
    // }else{
    //   QR.qrApi.draw('https://web.krspace.cn/kr_meeting/index.html?inviteeId='+this.inviteeId,"mycanvas",150,150);
    // }
    //   }
    // })
  },
  onUnload: function() {
    if (this.status == 1) {
      wx.reLaunch({
        url: "../index/index"
      });
    }
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
  },
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    wx.reportAnalytics("sharemeeting");

    return {
      title:
        '戳我一键参会！邀请您于"' +
        this.data.meetingDetailData.meetingTime +
        '"在"' +
        this.data.meetingDetailData.meetingRoomName +
        '"参加"' +
        this.data.meetingDetailData.theme +
        '"',
      path: "pages/meetingStatus/meetingStatus?inviteeId=" + this.inviteeId,
      imageUrl: "../images/indexImg/statusbg.png"
    };
  },

  //点击取消参会
  cancelMeeting() {
    wx.reportAnalytics("cancelmeeting");
    meetingData.cancelMeeting(this.inviteeId, this.data.inviteers, this);
    // let that = this;
    // wx.showModal({
    //   title: '提示',
    //   content: '取消参会后，会议开始前您可以从我的订单或会议邀请中，再次参加会议哦～',
    //   cancelText:'暂不取消',
    //   confirmText:'无情走开',
    //   confirmColor:'#F5A623',
    //   success: function(res) {
    //     if (res.confirm) {
    //       app.getRequest({
    //         url:app.globalData.KrUrl+'api/gateway/krmting/invitee/cancel',
    //         methods:"GET",
    //         header:{
    //           "content-type":"application/json"
    //         },
    //         data:{
    //           inviteeId:that.inviteeId
    //         },
    //         success:(res)=>{
    //           console.log(res,"取消参会")

    //           wx.getStorage({
    //             key: 'user_info',
    //             success:(res)=>{
    //               that.data.inviteers.forEach((item,index)=>{
    //                 if(item.wechatAvatar === res.data.user_info.avatarUrl && item.wechatNick === res.data.user_info.nickName){
    //                   // that.data.meetingDetailData.inviteers.splice(index, 1)
    //                   that.data.inviteers.splice(index,1)
    //                 }
    //               })
    //               that.setData({
    //                 // meetingDetailData: that.data.meetingDetailData,
    //                 inviteers:that.data.inviteers
    //               })
    //             },
    //           })

    //         }
    //       })
    //       wx.reLaunch({
    //         url:"../index/index"
    //       })
    //     } else if (res.cancel) {

    //     }
    //   }
    // })
  },

  closeDialog() {
    this.setData({
      qrDialog: false,
      phoneDialog: false,
      passwordDialog: false
    })
  },

  scanCode() {
    if (this.data.meetingDetailData.meetingStatus === "EXPIRED") {
      return;
    }
    scanCode.scanCode('MEETING', this.inviteeId, this);
  },

  scaleCode() {
    this.setData({
      qrDialog: true,
    }, () => {
      if (this.data.meetingDetailData.meetingStatus === "EXPIRED") {
        QR.qrApi.draw(
            "https://web.krspace.cn/kr-meeting/kr_meeting_h5/index.html?inviteeId=" +
            this.inviteeId,
            "mycanvas",
            160,
            160,
            null,
            "rgba(0,0,0,0.3)"
        );
      } else {
        QR.qrApi.draw(
            "https://web.krspace.cn/kr-meeting/kr_meeting_h5/index.html?inviteeId=" +
            this.inviteeId,
            "mycanvas",
            160,
            160
        );
      }
    });

  },

  moveToBind() {
    this.setData({
      phoneDialog: false,
    });
    wx.setStorage({
      key: 'bind_phone_auth',
      data: {
        KmTargetId: this.inviteeId,
        KmTodoType: 'MEETING'
      }
    });
    wx.setStorage({
      key: 'bind_phone_url',
      data: "../meetingDetail/meetingDetail?inviteeId=" + this.inviteeId,
      success: (res) => {
        wx.navigateTo({
          url: "../bindPhone/bindPhone?fun=goStorageUrl&auth=true"
        });
      }
    });
  },
});
