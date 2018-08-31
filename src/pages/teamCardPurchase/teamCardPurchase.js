const app = getApp()
Page({
    data: {
        swiperIndex: 1,
        check: true,
        btn_bool: true,
        cardNum: 10,
        passWord: false,
        payOk: false,
        KrImgUrl: app.globalData.KrImgUrl
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
    },
    // 用户权限
    onGotUserInfo(e) {
        if (e.detail.userInfo) {
            this.setData({ btn_bool: false })
        }
    },
    swiperChange(e) {
        this.setData({
            swiperIndex: e.detail.current+1
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
    check() {}
})