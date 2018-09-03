const app = getApp()
Page({
    data: {
        KrImgUrl: app.globalData.KrImgUrl,
        card: true,
        checked: false,
        name: '春天花花团队卡春天花',
        changeNametext: '',
        nameShow: false,
        tip: ''
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
    },
    switchChange(e) {
        this.setData({
            checked: e.detail.value
        })
    },
    toRecordList() {},
    toPersonList() {},
    changeName() {
        this.setData({
            nameShow: true,
            changeNametext: this.data.name
        })
    },
    cancel() {
        this.setData({
            nameShow: false,
            changeNametext: ''
        })
    },
    sure() {
        if ( !!this.data.changeNametext.trim() ) {
            this.setData({
                nameShow: false,
                name: this.data.changeNametext,
            })
        } else {
            this.setData({
                tip: '请填写团队卡名称～'
            })
            setTimeout(() => {
                this.setData({
                    tip: ''
                })
            }, 2000)
        }
    },
    bindKeyInput(e) {
        this.setData({
            changeNametext: e.detail.value
        })
    }
})