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
        pageSize:10,
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
        weChatId:'1383',
        // weChatId:'',
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
        isNewUser:false,// 切换 新人双倍 弹框状态
        isNewUserFlag:false,// 调用SAVA接口后  保存 是否是新人判断
        // animationCloudData:''
    },
    aaa :3445,
    james:'',
    other:'',
    onLoad(options) {
      let weChatId;
      if(options.scene){
        weChatId = decodeURIComponent(options.scene);
      }else if(options.weChatId){
        weChatId = options.weChatId
      }
      wx.reportAnalytics("viewassis");
      // this.setData({
      //   weChatId:weChatId
      // })
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
  //页面上拉触底事件
  onReachBottom: function() {
    const that = this;
    if (that.data.page < that.data.totalPages) {
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
          that.setData({
            items: [].concat(that.data.items, res.data.data.items),
            totalAmount: res.data.data.totalAmount,
            totalCount: res.data.data.totalCount,
            totalPages: res.data.data.totalPages,
            page: that.data.page,
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
    //登录
    login: function() {
      let that = this;
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
              methods: "GET",
              data: {
                code: res.code
              },
              success: res => {
                app.globalData.Cookie =
                res.header["Set-Cookie"] || res.header["set-cookie"];
                app.globalData.openid = res.data.data["openid"];
                that.sharedInf();
                that.firendAssistanceList();
              },
              fail: err => {
              }
            });
          } else {
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
    var that = this;
    wx.showLoading({
      title: "助力中",
      mask: true
    });
            // 判断 是否是新人 弹出新人双倍 提示框 
            that.setData({
               isNewUser:that.data.isNewUserFlag
            })
            setTimeout(function(){
              that.setData({
                isNewUser:false
              })
            },2000)
            app.getRequest({
              url: app.globalData.KrUrl + "api/gateway/kmbooster/booster",
              method:'POST',
              data: {
                firstCustomer: that.data.isNewUserFlag,
                id: that.data.weChatId
              },
              success: res => {
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
        if(res.data.code === 1){
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
                    that.setData({
                            assistanceFlag:true,
                            alsoAssistanceFlag:true
                          });
                        if(res.data.data.amount < 10){
                          that.james.stop('0'+res.data.data.amount)    
                        }else{
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
            success: res => {

              console.log('save');
              if(res.data.code === 1){
                console.log('save123');
                console.log(res.data.data.firstCustomer);
              }
              that.setData({
                isNewUserFlag:res.data.data.firstCustomer
              })
            }
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