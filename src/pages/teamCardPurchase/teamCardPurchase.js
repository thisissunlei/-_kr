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
        list: []
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
        this.setData({
            passWord: true
        })
    },
    cancel() {
        this.setData({
            passWord: false,
            payOk: false
        })
    },
    sure() {

    },
    check() {},
    getGoodsList() {
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/goods-list",
            methods: "GET",
            success: res => {
                // [{
                //     "activeDuration":30,
                //     "cardIntro":"团体卡防守打法家居干扰就能发我爱哦静安寺of加涅啊我就能发惹你",
                //     "cardName":"丁卯测试",
                //     "cardNo":"180904001",
                //     "cardType":"NORMAL",
                //     "creater":-1,
                //     "ctime":1536045850000,
                //     "custom":false,
                //     "faceValue":120000,
                //     "faceValueDecimal":1200,
                //     "id":5,
                //     "limitCount":20,
                //     "published":true,
                //     "quantity":100,
                //     "quantityType":"INF",
                //     "salePrice":100,
                //     "salePriceDecimal":1,
                //     "verifyCode":""}]





                this.setData({
                    list: res.data.data
                })
            },
            fail: res => {}
        });
    }
})