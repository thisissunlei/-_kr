const app = getApp()
import {demoAnimate,demoAnimates} from '../../utils/animate.js';
Page({
    data: {
        assistance:{},
        btn_bool:true,
        user_info:'',
        assistanceFlag:false,
        pageNum:1,
        pageSize:10,
        wechatAvatar:'',
        wechatNick:'',
        amount:'',
        totalAmount:'',
        totalCount:'',
        items:[],
        numArr:[{label:'0'},{label:'0'}],
        numArrs:[{label:'0'},{label:'0'}],
        number:'520',
        KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
    },
    aaa :3445,
    james:'',
    other:'',
    onLoad(options) {
      let that = this;
      let numArr = this.data.numArr;
      let numArrs = this.data.numArrs;
      this.james = new demoAnimates({
            numArr:numArr,
            _this:that,
            callback:function(that){console.log('ok',that,that.aaa)}
          });
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            that.setData({
              hasUserInfo: true
            });
            that.login();
          } else {
            that.login();
          }
        }
      });
    },
    // 下拉刷新
    onPullDownRefresh(e) {
        
    },
    // 上拉加载
    onReachBottom() {
      
    },
    //获取用户信息
    getInfo: function() {
      console.log("获取用户信息");
      var that = this;
      wx.getUserInfo({
        success: function(res) {
          console.log("获取用户信息成功!!!");
          // that.setData({
          //   avatarUrl: res.userInfo.avatarUrl
          // });
          //保存到storage里
          console.log(res)
          wx.setStorage({
            key: "user_info",
            data: {
              user_info: res.userInfo
            }
          });
          app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/krmting/user/save",
            data: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
            success: res => {}
          });
        }
      });
    },  
  //助力详情
    //登录
    login: function() {
      let that = this;
      wx.login({
        success: function(res) {
              console.log("登陆");
          if (res.code) {
            wx.request({
              url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
              methods: "GET",
              data: {
                code: res.code
              },
              success: res => {
                console.log("登陆成功!!");
                that.setData({
                  btn_bool: false
                });
                app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
                app.globalData.openid = res.data.data["openid"];
                //that.getInfo();
                // that.getAssistance();
                that.sharedInf();
                that.firendAssistanceList();
              },
              fail: err => {
                console.log(err);
              }
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    },
  // 助力
  postAssistance: function (){
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/booster",
      method:'POST',
      data: {
        firstCustomer: true,
        id: 1384
      },
      success: res => {
         
      }
    });
  },  
  // 分享详情接口 kmbooster/shared-info 
  sharedInf: function(){
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/shared-info",
      method:'GET',
      data: {
        wechatId: 1361
      },
      success: res => {
              console.log(res.data)
              if(res.data.code === 1){
                that.setData({
                wechatAvatar:res.data.data.wechatAvatar,
                wechatNick:res.data.data.wechatNick,
                amount:res.data.data.amount
              })
              if(res.data.data.booster === 1){
                this.setData({
                  assistanceFlag:true
                });
                    }else{
                      that.setData({
                        assistanceFlag:false
                      })
                }
          }

      }
    });
  },
  // 加载更多
  getMore: function(){
    var that = this;
    that.setData({
      pageNum:that.data.pageNum+1
    })
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      method:'GET',
      data: {
        page:1,
        pageSize: that.data.pageSize*that.data.pageNum,
        wechatId:1361
      },
      success: res => {
          if(res.data.code === 1){
            that.setData({
                totalCount:res.data.data.totalCount,
                totalAmount:res.data.data.totalAmount,
                items:res.data.data.items
            })
          }
      }
    });
  },
  firendAssistanceList: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      method:'GET',
      data: {
        page:1,
        pageSize: that.data.pageSize*that.data.pageNum,
        wechatId:1361
      },
      success: res => {
          if(res.data.code === 1){
            that.setData({
                totalCount:res.data.data.totalCount,
                totalAmount:res.data.data.totalAmount,
                items:res.data.data.items
            })
          }
      }
    });
  },
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
        this.login();
    }
  }
})