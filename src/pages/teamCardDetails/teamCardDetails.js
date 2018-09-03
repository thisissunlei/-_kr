const app = getApp()
Page({
    data: {
        KrImgUrl: app.globalData.KrImgUrl,
        card: true
    },
    onLoad(options) {},
    turnCardToAfter() {
        this.setData({
            card: false
        })
    },
    turnCardToBefore() {
        this.setData({
            card: true
        })
    }
})