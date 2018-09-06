const app = getApp()
Page({
    data: {
        swiperIndex: 0,
        check: true,
        btn_bool: true,
        cardNum: 10,
        passWord: false,
        payOk: false,
        KrImgUrl: app.globalData.KrImgUrl,
        list: [],
        phase: '',
        payFail: false,
        tip: ''
    },
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
        this.getGoodsList()
    },
    onShow() {
        wx.getStorage({
            key: 'goods_order_ok',
            success: (res) => {
                if(res.data === 'ok'){
                    this.setData({
                        payOk: true
                    })
                } else if ( res.data === 'no' ) {
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
    // 用户权限
    onGotUserInfo(e) {
        if (e.detail.userInfo) {
            this.setData({ btn_bool: false })
        }
    },
    swiperChange(e) {
        this.setData({
            swiperIndex: e.detail.current
        })
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
                } else if ( res.data.data === -2 ) {
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
            data: 'close',
        })
        this.setData({
            passWord: false,
            payOk: false,
            phase: ''
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
        wx.setStorage({
            key: "goods_order_ok",
            data: 'close',
        })
        this.setData({
            passWord: false,
            payOk: false
        })
        wx.navigateTo({
            url: '../myTeamCard/myTeamCard'
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
                    })
                } else {
                    res.data.data = []
                }
                this.setData({
                    list: res.data.data
                })
            },
            fail: res => {}
        })
    }
})