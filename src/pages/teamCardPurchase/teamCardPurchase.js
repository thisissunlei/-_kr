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
        phase: ''
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
                if ( res.data.code === -1 ) {} else if ( res.data.data === -2 ) {
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
                            console.log(response)
                        },
                    })
                }

            },
            fail: res => {}
        });
    },
    cancel() {
        this.setData({
            passWord: false,
            payOk: false
        })
    },
    sure() {
        this.goodsCreateOrder()
    },
    check() {
        this.setData({
            passWord: false,
            payOk: false
        })
        wx.navigateTo({
            url: '../myTeamCard/myTeamCard'
        })
    },
    getGoodsList() {
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/goods-list",
            methods: "GET",
            success: res => {
                this.setData({
                    list: res.data.data
                })
            },
            fail: res => {}
        });
    }
})