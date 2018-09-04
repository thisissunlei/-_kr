const app = getApp()
Page({
    data: {},
    onLoad() {},
    down: false,
    // 下拉刷新
    onPullDownRefresh(e) {
        if ( !!this.down ) return
        this.down = true
        wx.startPullDownRefresh({
            success: () => {
                this.getData()
            }
        })
    },
    // 上拉加载
    onReachBottom() {
        console.log('000')
    },
    getData() {
        // 停止动画
        setTimeout(() => {
            wx.stopPullDownRefresh()
            this.down = false
        }, 2000)
    }
})