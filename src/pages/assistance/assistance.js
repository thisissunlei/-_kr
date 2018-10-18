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
        page:1,
        pageNum:1,
        pageSize:2,
        totalPages:1,
        isMoreFlag:false,
        amountIsFull:false,// 被助力人礼券池已满弹框
        assistantAmountIsFull:false,// 助力人礼券池已满
        amountIsFullTen:false,// 每天助力超过10次 限制
        animateMoneyFlag:false,//钱动画
        pageLoadFlag:true,//页面加载
        wechatAvatar:'',
        wechatNick:'',
        amount:'',
        // weChatId:'1383',
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
        error:false,
        errorMessage:'',
        moreFlag:false,
        pageOnloadFlag:false,//页面加载前 判断 跳转状态
        activityFlag:false, // 判断活动 是否 结束
        isAssistanceFlag:false,
        isNewUser:false,// 判断是都是新用户
        // animationCloudData:''
    },
    aaa :3445,
    james:'',
    other:'',
    onLoad(options) {
      wx.reportAnalytics("viewassis");
      this.setData({
        weChatId:options.weChatId
      })
      let that = this;
      wx.showLoading({
        title: "加载中",
        mask: true
      });
        // 判断活动是否结束
        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/kmbooster/ovedue",
          method:'GET',
          data: {
            activityId: 1
          },
          success: res => {
              console.log('res123');
              console.log(res);
              if(res.data.data){
                that.setData({
                  activityFlag:true
                })
              }else{
                that.setData({
                  activityFlag:false
                })
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
        wx.showLoading({
        title: "加载中",
        mask: true
      });
        console.log('Onready')
        setTimeout(function(){
          that.setData({
            initTwos:"two two-animation delay",
            initTwo:'two two-animation',
            initOnes:'one one-animation delay',
            initOne:'one one-animation'
          })
          wx.hideLoading();
        },1500)
    },
    // // 加载更多  
    // getMore: function(){
    //   var that = this;
    //   that.setData({
    //     pageSize:that.data.pageSize+=2,
    //     pageLoadFlag:false
    //   })
    //   app.getRequest({
    //     url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
    //     method:'GET',
    //     data: {
    //       page:1,
    //       pageSize: that.data.pageSize,
    //       wechatId: that.data.weChatId
    //     },
    //     success: res => {
    //         if(res.data.code === 1){
    //           that.setData({
    //               totalCount:res.data.data.totalCount,
    //               totalAmount:res.data.data.totalAmount,
    //               items:res.data.data.items,
    //               pageLoadFlag:true
    //           })
    //         }
    //     }
    //   });
    // },
  //页面上拉触底事件
  onReachBottom: function() {
    console.log("上拉刷新!!!");
    const that = this;
    // console.log(this.currentData);
    console.log(that.data.page )
    console.log(that.data.totalPages )
    if (that.data.page < that.data.totalPages) {
      console.log("上拉刷新!!!2222");
      that.setData({
        page:that.data.page+=1,
        pageLoadFlag:false
      })
      app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
        data: {
          page: that.data.page,
          pageSize: that.data.pageSize,
          wechatId: that.data.weChatId
        },
        success: res => {
          console.log("下拉分页");
          console.log(res);
          that.setData({
            items: [].concat(that.data.items, res.data.data.items),
            totalAmount: res.data.data.totalAmount,
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
            page: that.page,
            pageLoadFlag:true
          });
          if(res.data.data.totalPages > that.data.page){
                  that.setData({
                  isMoreFlag:true
                  })
            }else {
                  that.setData({
                  isMoreFlag:false
                  }) 
            }
        }
      });
    } 
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
                app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
                app.globalData.openid = res.data.data["openid"];
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
  goToHome: function (){
    wx.redirectTo({
      url: '../index/index'
    })    
  },
  // 跳转新人引导页
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
  // 跳转查看页 不回来
  redirectToCreateImg:function (){
    wx.redirectTo({
      url: '../createImg/createImg'
    })
  },
  // 规则 
  rule: function (){
      this.setData({
        // pageOnloadFlag:false,
        rule:true
      })
  },
  // 关闭规则显示
  ruleClose: function (){
      this.setData({
        // pageOnloadFlag:true,
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
      data: {},
      success: res => {
        console.log('请求是否新人  成功!!');
        console.log(res.data.data);
        console.log('请求助力数--参数',res.data.data,that.data.weChatId);
            // 判断 是否是新人 弹出新人双倍 提示框 
            that.setData({
               isNewUser:res.data.data
            })
            setTimeout(function(){
              that.setData({
                isNewUser:false
              })
            })
            app.getRequest({
              url: app.globalData.KrUrl + "api/gateway/kmbooster/booster",
              method:'POST',
              data: {
                firstCustomer: res.data.data,
                id: that.data.weChatId
              },
              success: res => {
                console.log('zhuli',res.data)
                let code = res.data.code
                if(code == -1){
                  that.setError(res.data.message)
                  return;
                }
                wx.hideLoading();
                if(res.data.data.boosterAamount === -1){
                      that.setData({
                        amountIsFull:true
                      })
                      return ;
                }
                if(res.data.data.boosterAamount === -2){
                  that.setData({
                    assistantAmountIsFull:true
                  })
                  return ;
                }
                if(res.data.data.boosterAamount === -3){
                    that.setData({
                      amountIsFullTen:true
                    })
                      setTimeout(function(){
                        that.setData({
                          amountIsFullTen:false
                        })
                      },1500)
                    return ;
                }
                      that.setData({
                        animateMoneyFlag:true,
                        alsoAssistanceAmount:res.data.data.boosterAamount
                      })
                      that.setData({
                        alsoAssistanceFlag:true,
                        assistanceFlag:true
                      })
                      setTimeout(function(){
                        that.setData({
                          animateMoneyFlag:false,
                        })
                      },2000)
                      that.firendAssistanceList();
                      if(res.data.data.boosterAamount<10){
                        that.james.stop("0"+res.data.data.boosterAamount)
                      }else{
                        that.james.stop(res.data.data.boosterAamount+"")
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
              console.log('res.data.data.booster');
              console.log(res.data.data.booster);
              console.log("res.data.data.ownerVisit");
              console.log(res.data.data.ownerVisit)
             if(res.data.data.ownerVisit === 1){
                    that.redirectToCreateImg();
             }else{
              wx.hideLoading();
              that.setData({
                pageOnloadFlag:true,
                wechatAvatar:res.data.data.wechatAvatar,
                wechatNick:res.data.data.wechatNick,
                alsoAssistanceAmount:res.data.data.amount,
              })
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
      }
    });
  },
  // 每天助力超过10次提示
  showIsTenTimes: function(){
    console.log("closeknow!!!");
      this.setData({
        assistantAmountIsFull:false
      })
  },
  // 关闭 助力人礼券已满 弹框
  closeknow: function(){
    console.log("closeknow!!!");
      this.setData({
        assistantAmountIsFull:false
      })
  },
  // 关闭  提示被助力人礼券池已满 的弹框
  closeButtonIsee: function(){
       this.setData({
        amountIsFull:false
      })
  },
  // 获取被助力人  助力列表 分页
  firendAssistanceList: function() {
    var that = this;
    app.getRequest({
      url: app.globalData.KrUrl + "api/gateway/kmbooster/friends-booster",
      method:'GET',
      data: {
        page:1,
        pageSize: that.data.pageSize,
        wechatId:that.data.weChatId
      },
      success: res => {
        console.log('res.data.data.totalCount')
        console.log(res.data.data.totalCount)
          if(res.data.code === 1){
            if(res.data.data.totalCount >0){
                that.setData({
                  isAssistanceFlag:true
                 })
            }else{
              that.setData({
                isAssistanceFlag:false
               })
            }
            that.setData({
                totalPages:res.data.data.totalPages,
                totalCount:res.data.data.totalCount,
                totalAmount:res.data.data.totalAmount,
                items:res.data.data.items
            })
            if(res.data.data.totalPages > that.data.page){
                 that.setData({
                  isMoreFlag:true
                 })
            }else {
                 that.setData({
                  isMoreFlag:false
                 }) 
            }
          }
      }
    });
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
    setError(msg){
      let that = this;
      that.setData({
          error:true,
          errorMessage:msg
      })
      setTimeout(function(){
        that.setData({
          error:false,
          errorMessage:''
        })
      },2000)

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