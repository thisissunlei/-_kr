//index.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function() {
    wx.reportAnalytics('sharekrmeeting')
    return {
      title: 'KrMeeting会议室，让会议更轻松、更简单',
      desc: 'KrMeeting会议室',
      path: "pages/index/index",
      imageUrl : '../images/share_pic.jpg'
    };
  },
  
  data: {
    noSwiper:true,
    swiper:true,
    indicatorDots:true,
    metting:false,
    btn_bool:true,
    duration: 1000,
    buildingList:[],
    myMeeting:[],
    noOpenBuilding:[
      {
        buildName:"万科大都会",
        buildAddress:"北京市朝阳区东三环中路甲10号",
        buildImgUrl:"../images/indexImg/wk.jpg",
        distance:"",
        meetingCount:"5"
      },
      {
        buildName:"海峡国际大厦",
        buildAddress:"北京市西城区三里河东路30号院1号楼海峡国际大厦",
        buildImgUrl:"../images/indexImg/hxgj.jpg",
        distance:"",
        meetingCount:"18"
      },
      {
        buildName:"创业大街",
        buildAddress:"北京市海淀区中关村创业大街2号楼",
        buildImgUrl:"../images/indexImg/cydj.jpg",
        distance:"",
        meetingCount:"6"
      },
      {
        buildName:"吉祥大厦",
        buildAddress:"北京市东城区王府井大街88号",
        buildImgUrl:"../images/indexImg/jxds.jpg",
        distance:"",
        meetingCount:"6"
      },
      {
        buildName:"虹桥绿谷广场",
        buildAddress:"上海市闵行区甬虹路69号虹桥绿谷广场G栋",
        buildImgUrl:"../images/indexImg/hqlg.jpg",
        distance:"",
        meetingCount:"14"
      },
      {
        buildName:"世纪汇",
        buildAddress:"上海市浦东新区世纪大道1196号世纪汇办公楼二座",
        buildImgUrl:"../images/indexImg/sjh.jpg",
        distance:"",
        meetingCount:"12"
      },
      {
        buildName:"海洋大厦",
        buildAddress:"上海市黄浦区延安东路550号海洋大厦",
        buildImgUrl:"../images/indexImg/hyds.jpg",
        distance:"",
        meetingCount:"16"
      },
      {
        buildName:"华山路",
        buildAddress:"上海市静安区华山路328号",
        buildImgUrl:"../images/indexImg/hsl.jpg",
        distance:"",
        meetingCount:"18"
      },
      {
        buildName:"凯旋路",
        buildAddress:"上海市长宁区凯旋路399号1幢",
        buildImgUrl:"../images/indexImg/kxl.jpg",
        distance:"",
        meetingCount:"18"
      },
      {
        buildName:"由由国际",
        buildAddress:"上海市浦东新区浦建路76号由由国际广场写字楼",
        buildImgUrl:"../images/indexImg/zygj.jpg",
        distance:"",
        meetingCount:"6"
      },
      {
        buildName:"由由世纪",
        buildAddress:"上海市浦东新区杨高南路428号由由世纪1号楼写字楼名义楼层",
        buildImgUrl:"../images/indexImg/zysj.jpg",
        distance:"",
        meetingCount:"6"
      },
      {
        buildName:"裕徳路",
        buildAddress:"上海市徐汇区裕德路126号",
        buildImgUrl:"../images/indexImg/ydl.jpg",
        distance:"",
        meetingCount:"18"
      },
      {
        buildName:"田林路",
        buildAddress:"上海市徐汇区田林路130号20号楼",
        buildImgUrl:"../images/indexImg/tll.jpg",
        distance:"",
        meetingCount:"8"
      },
      {
        buildName:"TIT创意园",
        buildAddress:"广州市海珠区新港中路397号T.I.T创意园自编3-9号",
        buildImgUrl:"../images/indexImg/TIT.jpg",
        distance:"",
        meetingCount:"6"
      },
      {
        buildName:"保利国际中心",
        buildAddress:"武汉市东湖新技术开发区关山大道332号保利国际中心",
        buildImgUrl:"../images/indexImg/blgj.jpg",
        distance:"",
        meetingCount:"8"
      },
    ]
  },
  rq_data:{
    latitude:'',
    longitude:'',
  },
  func_bool_g:false,
  func_bool_l:false,
  func_bool_l2:false,
  func_bool_s:false,
  //获取地理位置
  getLocation:function(){
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        _this.rq_data = {
          latitude:res.latitude,
          longitude:res.longitude
        };
        wx.setStorage({
          key:"lat_log",
          data: {
            lat_log:{
              latitude:res.latitude,
              longitude:res.longitude
            }
          },
        });
        _this.func_bool_g = true;
        if(_this.func_bool_g&&_this.func_bool_l){
          _this.func_bool_g = false;
          _this.func_bool_l = false;
          _this.getAllInfo();
        }
      },
      fail:function(res){
        _this.getAllInfo();
      }
    })
  },
  getURLParam:function(deal_url,paramName){
          var paramValue = "";
          var isFound = false;
          deal_url=decodeURIComponent(deal_url).substring(1,deal_url.length).split("?")[1];
          if ( deal_url.indexOf("=")>1){
              let arrSource = deal_url.split("&");
              let i = 0;
              while (i < arrSource.length && !isFound){
                  if (arrSource[i].indexOf("=") > 0){
                       if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase()){
                          paramValue = arrSource[i].split("=")[1];
                          isFound = true;
                       }
                  }
                  i++;
              }   
          }
          
          return paramValue;
  },
  onLoad: function (options) {
    const that = this;
        console.log(options.q)
    if(options.q){
      const channelname_v = that.getURLParam(options.q,'id')
      wx.reportAnalytics('idx_channel',{
        channelname: channelname_v,
      });
      console.log(channelname_v,11111)
    }    
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    
    this.getLocation();
    //页面加载
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.KrUrl+'api/gateway/krmting/common/login',
            data: {
              code: res.code
            },
            success:function(res){
              wx.hideLoading();
              that.func_bool_l = true;
              that.func_bool_l2 = true;
              app.globalData.Cookie = res.header['Set-Cookie']||res.header['set-cookie'];
              app.globalData.openid = res.data.data['openid'];
              if(that.func_bool_g&&that.func_bool_l){
                that.func_bool_g = false;
                that.func_bool_l = false;
                that.getAllInfo();
              }
              if(that.func_bool_l2&&that.func_bool_s){
                that.func_bool_s = false;
                that.func_bool_l2 = false;

                that.getInfo();
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }

    }),
    
  //  wx.request({
  //     url:'https://www.easy-mock.com/mock/5b0bf5b41725f034fca4cc78/kr/mettingdetail/home',
  //     methods:"GET",
  //     header:{
  //       'content-type':"appication/json"
  //     },
  //     data:{
  //       latitude:this.rq_data.latitude,
  //       longitude:this.rq_data.longitude
  //     },
  //     success:(res)=>{
  //       this.setData({
  //         buildingList:res.data.buildingList,
  //         myMeeting:res.data.myMeeting
  //       })
  //       if(res.data.myMeeting.length>0){
  //         this.setData({
  //           metting:true

  //         })
  //       }
  //     }
  //   })
    
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('用户没有授权：用户信息！')
        }else{
          that.func_bool_s = true;
          if(that.func_bool_s&&that.func_bool_l2){
            that.func_bool_s = false;
            that.func_bool_l2 = false;

            that.getInfo();
          }
          
          that.setData({
            btn_bool:false
            
          });
        }
      }
    })
    
  },
  onShow:function(){
    this.getAllInfo(this.rq_data.latitude,this.rq_data.longitude)
  },
  getAllInfo:function (){
    var that = this;
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/home',
      data:{
        latitude:that.rq_data.latitude,
        longitude:that.rq_data.longitude
      },
      success:(res)=>{
        console.log(res,'列表')
        let buildingList = res.data.data.buildingList
        let myMeeting = res.data.data.myMeeting
        buildingList.forEach(element => {
          if(element.distance>10000){
            element.distance =  Math.floor(element.distance/10000)+'w'+' '+'km'
          }else if(element.distance>1000){
            element.distance = (element.distance/1000).toFixed(1)+'km' 
          }else{
            element.distance = Math.round((element.distance)*10)/10+'m'
          }
          
        });
        that.setData({
          buildingList:res.data.data.buildingList||[],
          myMeeting:res.data.data.myMeeting||[],
        })
        if(that.data.myMeeting.length==0){
          that.setData({
            metting:false
          })
        }else if(that.data.myMeeting.length==1){
          that.setData({
            metting:true,
            indicatorDots:false,
            noSwiper:true,
            swiper:false,
          })
        }else{
          that.setData({
            metting:true,
            noSwiper:false,
            swiper:true,
          })
        }
        
        console.log(that.data.metting)
      }
    });
  },
  //获取用户信息
  getInfo:function(){
    var that = this;
    wx.getUserInfo({
      success: function(res) { 
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
        })
        //保存到storage里
        wx.setStorage({
          key:"user_info",
          data: {
            user_info:res.userInfo
          },
        });
        app.getRequest({
          url:app.globalData.KrUrl+'api/gateway/krmting/user/save',
          
          data:{
            encryptedData:res.encryptedData,
            iv:res.iv,
          
          },
          success:(res)=>{
            
          }
        });
      }
    })
  },
  //跳转新人指导
  point:function(){
    wx.reportAnalytics('viewguide')
    wx.navigateTo({
      url:"../point/point"
    })
  },
  //点击会议card
  moveToMeetingDetail:function(e){
    console.log(e)
    var  inviteeId=e.currentTarget.dataset.id
    // wx.reportAnalytics('goodsdetails')

    wx.navigateTo({
      url:"../meetingDetail/meetingDetail?inviteeId="+inviteeId
    })
  },

  jumpToMeetingDetail:function(){
   var inviteeId = this.data.myMeeting[0].id
   wx.navigateTo({
    url:"../meetingDetail/meetingDetail?inviteeId="+inviteeId
  })
  },
  //点击会议室进入会议室列表
  moveToMeetingRoom:function(e){
    wx.reportAnalytics('viewcommunity')

    var communityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../boardroomList/boardroomList?communityId="+communityId
    })
  },
  //
  moveToMy:function(){
    wx.reportAnalytics('viewusercenter')
    wx.navigateTo({
      url:"../my/my"
    })
  },

  onGotUserInfo:function (e){
    if(e.detail.userInfo){
      this.getInfo();
      this.setData({
        btn_bool:false
      });
    }
    
  },


})
