const app = getApp()
// import {demoAnimate,demoAnimates} from '../../utils/animate.js';
import {demoAnimate,Animates} from '../../utils/numAnimate.js';
Page({
    data: {
        hasUserInfo: false,
        assistance:{},
        rule:false,
        user_info:'',
        assistanceFlag:true,
        alsoAssistanceFlag:false,
        alsoAssistanceAmount:'',
        pageNum:1,
        pageSize:10,
        amountIsFull:false,
        wechatAvatar:'',
        wechatNick:'',
        amount:'',
        weChatId:'',
        totalAmount:'',
        totalCount:'',
        isNew:false,
        items:[],
        numArr:[{label:'0'},{label:'0'}],
        numArrs:[{label:'0'},{label:'0'}],
        number:'520',
        KrImgUrl: app.globalData.KrImgUrl, //CDN图片路径
        animationOne:'',
        animationTwo:'',
        initOne:'one',
        initOnes:'one',
        initTwo:'two',
        initTwos:'two',
        // animationCloudData:''
    },
    aaa :3445,
    james:'',
    other:'',
    onLoad(options) {
      this.setData({
        weChatId:options.weChatId
      })
      let that = this;
      wx.showLoading({
        title: "加载中",
        mask: true
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
    onReady(){
      let that = this;
      let numArr = this.data.numArr;
      let numArrs = this.data.numArrs;
        this.james = new Animates({
            _this:that,
            callback:function(that){}
          });
        setTimeout(function(){
          that.setData({
            initTwos:"two two-animation delay",
            initTwo:'two two-animation',
            initOnes:'one one-animation delay',
            initOne:'one one-animation'
          })
        },1500)
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
                wx.hideLoading();
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
  // 跳转自由座首页
  goToPoint: function (){
    wx.navigateTo({
      url: "../point/point"
    });
  },  
  // 跳转查看页
  goToCreateImg: function (){
    console.log('去查看');
    wx.navigateTo({
      url: "../createImg/createImg"
    });
  },  
  // 规则 
  rule: function (){
      this.setData({
        rule:true
      })
  },
  ruleClose: function (){
      this.setData({
        rule:false
      }) 
  },
  // 助力
  postAssistance: function (){
    console.log("助力");
    var that = this;
    wx.showLoading({
      title: "助力中",
      mask: true
    });
    // 是否时新人
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/first-page",
      method:'GET',
      data: {
        firstCustomer: true,
        id: that.data.weChatId
      },
      success: res => {
        console.log('请求是否新人  成功!!');
        console.log(res.data.data);
            app.getRequest({
              url: app.globalData.KrUrl + "api/gateway/kmbooster/booster",
              method:'POST',
              data: {
                firstCustomer: res.data.data,
                id: that.data.weChatId
              },
              success: res => {
                wx.hideLoading();
                console.log('成功!!');
                console.log('res')
                console.log(res)
                console.log('res.data.data.boosterAamount')
                console.log(res.data.data.boosterAamount)
                if(res.data.data.boosterAamount === -1){
                      console.log('已超过999');
                      that.setData({
                        amountIsFull:true
                      })
                    console.log(that.data.amountIsFull)  
                }else{
                      console.log('未超过999');
                      that.setData({
                        alsoAssistanceAmount:res.data.data.boosterAamount
                      })
                      that.setData({
                        alsoAssistanceFlag:true,
                        assistanceFlag:true
                      })
                      that.firendAssistanceList();
                      if(res.data.data.boosterAamount<10){
                        that.james.stop("0"+res.data.data.boosterAamount)
                      }else{
                        that.james.stop(res.data.data.boosterAamount+"")
                      }
                      console.log("动画该停止得金额"+res.data.data.boosterAamount);
                }
              }
            });
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
        wechatId: that.data.weChatId
      },
      success: res => {
              console.log("分享详情接口 kmbooster/shared-info")
              console.log(res.data)
              if(res.data.code === 1){
                  that.setData({
                  wechatAvatar:res.data.data.wechatAvatar,
                  wechatNick:res.data.data.wechatNick,
                  alsoAssistanceAmount:res.data.data.amount,
                })
              console.log('res.data.data.booster');
              console.log(res.data.data.booster);
              if(res.data.data.booster === 1){
                console.log("已助力");
                    that.setData({
                            assistanceFlag:true,
                            alsoAssistanceFlag:true
                          });
                    console.log('res.data.data.amount')      
                    console.log(res.data.data.amount+'')
                        if(res.data.data.amount < 10){
                          console.log("小于10");
                          that.james.stop('0'+res.data.data.amount)    
                        }else{
                          console.log("大于10");
                          that.james.stop(res.data.data.amount+'')
                        }  
                    }else{
                      that.setData({
                            assistanceFlag:false,
                            alsoAssistanceFlag:false
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
        wechatId:that.data.weChatId
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
    // app.getRequest({
    //   url: app.globalData.KrUrl + "api/gateway/kmbooster/mybooster-pool",
    //   method:'GET',
    //   data: {
    //     page:1,
    //     pageSize: that.data.pageSize*that.data.pageNum,
    //     wechatId:that.data.weChatId
    //   },
    //   success: res => {
    //       if(res.data.code === 1){
    //         that.setData({
    //             totalAmount:amount,
    //         })
    //       }
    //   }
    // });
  },
  // 获取被助力人  助力列表
  firendAssistanceList: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      method:'GET',
      data: {
        page:1,
        pageSize: that.data.pageSize*that.data.pageNum,
        wechatId:that.data.weChatId
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
    // app.getRequest({
    //   url: app.globalData.KrUrl + "api/gateway/kmbooster/mybooster-pool",
    //   method:'GET',
    //   data: {
    //     page:1,
    //     pageSize: that.data.pageSize*that.data.pageNum,
    //     wechatId:that.data.weChatId
    //   },
    //   success: res => {
    //       if(res.data.code === 1){
    //         that.setData({
    //             totalAmount:res.data.data.totalAmount,
    //         })
    //       }
    //   }
    // });
  },
    //获取用户信息
  getInfo: function() {
      var that = this;
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            avatarUrl: res.userInfo.avatarUrl
          });
          //保存到storage里
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
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.getInfo();
      this.setData({
        hasUserInfo: true
      });
    }
  }
})