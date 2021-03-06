const app = getApp()
Page({
    data: {
        swiperIndex: 0,
        check: true,
        btn_bool: true,
        passWord: false,
        payOk: false,
        KrImgUrl: app.globalData.KrImgUrl,
        list: [],
        phase: '',
        payFail: false,
        tip: '',
        height: 0
    },
    orderId: null,
    onLoad(options) {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting["scope.userInfo"]) {
                    // console.log("用户没有授权：用户信息！")
                } else {
                    this.setData({ btn_bool: false })
                }
            }
        });
        wx.getSystemInfo({
            success: (res) => {


                console.log(res)
                this.setData({
                    height: res.windowHeight - res.windowWidth/750*634
                })
                console.log(res.windowHeight - res.windowWidth/750*634)
            }
        })
        this.getGoodsList()
    },
    onShow() {
        wx.getStorage({
            key: 'goods_order_ok',
            success: (res) => {
                if(res.data.state === 'ok'){
                    this.orderId = res.data.orderId
                    this.setData({
                        payOk: true
                    })
                } else if ( res.data.state === 'no' ) {
                    this.setData({
                        payFail: true
                    })
                    setTimeout(() => {
                        this.setData({
                            payFail: false
                        })
                    }, 2000)
                } else {
                    this.setData({
                        payOk: false
                    })
                }
            }
        })
    },
    onUnload() {
        wx.setStorage({
            key: "goods_order_ok",
            data: {
                state: 'close',

            },
        })
    },
    // 用户权限
    onGotUserInfo(e) {
        if (e.detail.userInfo) {
            this.setData({ btn_bool: false })
        }
    },
    swiperChange(e) {
        if ( e.detail.source == "touch" ) {
            if ( e.detail.current == 0 && this.data.swiperIndex > 1 ) {//卡死时，重置current为正确索引
                this.setData({
                    swiperIndex: this.data.swiperIndex
                })
            }  else {
                this.setData({
                    swiperIndex: e.detail.current
                })
            }
        }

    },
    changeCheckbox:function(){
        this.setData({
            check:!this.data.check
        })
    },
    goToGuide(){
        wx.navigateTo({
            url: '../guide/guide'
        })
    },
    buy() {
        if ( this.data.list[this.data.swiperIndex].cardType === 'NORMAL' ) {
            this.goodsCreateOrder()
        } else {
            this.setData({
                passWord: true
            })
        }
    },
    goodsCreateOrder() {
        let data = {
            cardGoodsId: this.data.list[this.data.swiperIndex].id
        }
        if ( !!this.data.phase ) {
            data.phase = this.data.phase
        }
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/create-order",
            methods: "GET",
            data: data,
            success: res => {
                if ( res.data.code === -1 ) {
                    this.setData({
                        tip: res.data.message
                    })
                    setTimeout(() => {
                        this.setData({
                            tip: ''
                        })
                    }, 2000)
                } else if ( res.data.code === -2 ) {
                    // 未绑定手机号
                    wx.setStorage({
                        key: "goods_order",
                        data: {
                            goods_order: data
                        },
                    })
                    wx.navigateTo({
                        url: '../bindPhone/bindPhone?fun=getGoodsData'
                    })
                } else {
                    wx.requestPayment({
                        nonceStr: res.data.data.wxPaySignInfo.noncestr,
                        orderId: res.data.data.wxPaySignInfo.orderId,
                        package: res.data.data.wxPaySignInfo.packages,
                        paySign: res.data.data.wxPaySignInfo.paySign,
                        signType: res.data.data.wxPaySignInfo.signType,
                        timeStamp: res.data.data.wxPaySignInfo.timestamp,
                        success: (response) => {
                            this.orderId = res.data.data.orderId
                            wx.setStorage({
                                key: "goods_order_ok",
                                data: {
                                    state: 'ok',
                                    orderId: this.orderId
                                },
                            })
                            this.setData({
                                payOk: true
                            })
                        },
                        fail: (response) => {
                            this.setData({
                                payFail: true
                            })
                            setTimeout(() => {
                                this.setData({
                                    payFail: false
                                })
                            }, 2000)
                        },
                    })
                }

            },
            fail: res => {
                this.setData({
                    payFail: true
                })
                setTimeout(() => {
                    this.setData({
                        payFail: false
                    })
                }, 2000)
            }
        });
    },
    cancel() {
        wx.setStorage({
            key: "goods_order_ok",
            data: {
                state: 'close'
            },
        })
        this.setData({
            passWord: false,
            payOk: false,
            phase: ''
        })
    },
    continue() {
        wx.setStorage({
            key: "goods_order_ok",
            data: {
                state: 'close'
            },
        })
        this.setData({
            passWord: false,
            payOk: false,
            phase: ''
        }, () => {
            this.getGoodsList()
        })
    },
    sure() {
        if ( !!this.data.phase.trim() ) {
            this.setData({
                passWord: false,
                payOk: false
            })
            this.goodsCreateOrder()
        } else {
            this.setData({
                tip: '请填写口令～'
            })
            setTimeout(() => {
                this.setData({
                    tip: ''
                })
            }, 2000)
        }
    },
    check() {
        wx.showLoading({
            mask: true
        });
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/order/card-id",
            methods: "GET",
            data: {
                orderId: this.orderId
            },
            success: res => {
                if ( res.data.code === 1 ) {
                    wx.hideLoading();
                    wx.setStorage({
                        key: "goods_order_ok",
                        data: {
                            state: 'close'
                        },
                    })
                    this.setData({
                        passWord: false,
                        payOk: false
                    })
                    wx.navigateTo({
                        url: '../teamCardDetails/teamCardDetails?cardId='+res.data.data
                    })
                } else {
                    this.check()
                }
            },
            fail: res => {}
        })
    },
    bindKeyInput(e) {
        this.setData({
            phase: e.detail.value
        })
    },
    getGoodsList() {
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/goods-list",
            methods: "GET",
            success: res => {
                if ( !!res.data.data && res.data.data.length > 0 ) {
                    res.data.data.forEach((val, i) => {
                        val.salePriceDecimal = val.salePriceDecimal.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,')
                        val.faceValueDecimal = val.faceValueDecimal.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,')
                        // val.cardNum
                        if ( !val.remainCardCount ) {
                            if ( val.quantityType == 'LIMIT' ) {
                                val.cardNum = false
                            } else {
                                val.cardNum = true
                            }
                        } else {
                            val.cardNum = true
                        }
                    })
                } else {
                    res.data.data = []
                }
                this.setData({
                    swiperIndex: 0,
                    list: res.data.data
                })
            },
            fail: res => {}
        })
    }
})