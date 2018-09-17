const app = getApp()
Page({
    data: {
        list: [],
        loading: true,
        dianShow: false
    },
    usedlistData: {
        cardId: null,
        page: 1,
        pageSize: 10
    },
    totalPages: 0,
    down: false,
    onLoad(options) {
        this.usedlistData.cardId = options.cardId
        wx.showLoading({
            mask: true
        });
        this.getUsedlist()
    },
    getUsedlist() {
        app.getRequest({
            url: app.globalData.KrUrl + "api/gateway/kmteamcard/teamcard/usedlist",
            methods: "GET",
            data: this.usedlistData,
            success: res => {
                this.totalPages = res.data.data.totalPages
                if ( this.totalPages <= this.usedlistData.page ) {
                    this.setData({
                        dianShow: true
                    })
                }
                if ( !!res.data.data.items && res.data.data.items.length > 0 ) {
                    res.data.data.items.forEach((val, i) => {
                        val.day = this.setTime(val.ctime, 'day')
                        val.time = this.setTime(val.ctime, 'time')
                        val.amount = val.amount.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,')
                    })
                    this.setData({
                        list: [].concat(this.data.list, res.data.data.items),
                        loading: false
                    })
                } else {
                    this.setData({
                        list: [].concat(this.data.list, []),
                        loading: false
                    })
                }
                wx.hideLoading()
                if ( this.down ) {
                    wx.stopPullDownRefresh()
                    this.down = false
                }
            },
            fail: res => {}
        });
    },
    // 下拉刷新
    onPullDownRefresh(e) {
        if ( !!this.down ) return
        this.down = true
        wx.startPullDownRefresh({
            success: () => {
                this.usedlistData.page = 1
                wx.showLoading({
                    mask: true
                });
                this.setData({
                    list: [],
                    loading: true
                }, () => {
                    this.getUsedlist()
                })
            }
        })
    },
    // 上拉加载
    onReachBottom() {
        if ( !this.totalPages || this.totalPages <= this.usedlistData.page ) return
        this.usedlistData.page = this.usedlistData.page+1
        this.getUsedlist()
    },
    setTime(time, state) {
        var y, M, d, h, m, s
        y = new Date(parseInt(time)).getFullYear();
        M = new Date(parseInt(time)).getMonth() + 1 >= 10 ? new Date(parseInt(time)).getMonth() + 1 : "0" + (new Date(parseInt(time)).getMonth() + 1);
        d = new Date(parseInt(time)).getDate() >= 10 ? new Date(parseInt(time)).getDate() : "0" + new Date(parseInt(time)).getDate();

        h = new Date(parseInt(time)).getHours() >= 10 ? new Date(parseInt(time)).getHours() : "0" + new Date(parseInt(time)).getHours();
        m = new Date(parseInt(time)).getMinutes() >= 10 ? new Date(parseInt(time)).getMinutes() : "0" + new Date(parseInt(time)).getMinutes();
        s = new Date(parseInt(time)).getSeconds() >= 10 ? new Date(parseInt(time)).getSeconds() : "0" + new Date(parseInt(time)).getSeconds();
        if ( state === 'day' ) {
            return  M + '-' + d
        } else {
            return h +':'+ m +':'+ s
        }
    }
})