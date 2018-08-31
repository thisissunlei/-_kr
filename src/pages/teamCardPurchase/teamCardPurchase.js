Page({
    data: {
        swiperIndex: 1
    },
    swiperChange(e) {
        this.setData({
            swiperIndex: e.detail.current+1
        })
    }
})