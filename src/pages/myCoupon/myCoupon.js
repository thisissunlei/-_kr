//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        list: [],
        couponTabType: 'USABLE',
        page: 1,
        number: 0,
        loading: true,
        changeShow: false,
        shardModal: false,
        couponIds: []
    },
    totalPages: 0,
    page: 1,
    couponIds: [],
    shareNo: 0,
    couponAmount: 0,
    onLoad() {
        wx.showLoading({
            title: "加载中",
            mask: true
        })
        if ( this.data.couponTabType === 'SHARE' ) {
            this.getShareList()
        } else {
            this.getList()
        }
    },
    couponTab(e) {
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        this.page = 1
        this.shareNo = ''
        this.couponIds = []
        this.couponAmount = ''
        this.setData({
            list: [],
            couponTabType: e.currentTarget.dataset.type,
            number: e.currentTarget.dataset.number,
            loading: true,
            changeShow: false,
            shardModal: false
        },() => {
            if ( e.currentTarget.dataset.type === 'SHARE' ) {
                this.getShareList()
            } else {
                this.getList()
            }
        })
    },
    getList() {
        app.getRequest({
            url:app.globalData.KrUrl+'api/gateway/krcoupon/user',
            method:"get",
            data: {
                couponTabType: this.data.couponTabType,
                page: this.page
            },
            success:(res)=>{
                if ( res.data.code > 0 ) {
                    this.setList(res.data.data)
                } else {
                    this.setData({
                        list: [],
                        loading: false
                    })
                    wx.hideLoading()
                }
            },
            fail:(res)=>{
                this.setData({
                    list: [],
                    loading: false
                })
                wx.hideLoading()
            }
        })
    },
    getShareList() {
        app.getRequest({
            url:app.globalData.KrUrl+'api/gateway/krcoupon/user/share',
            method:"get",
            data: {
                page: this.page
            },
            success:(res)=>{
                if ( res.data.code > 0 ) {
                    this.setList(res.data.data)
                } else {
                    this.setData({
                        list: [],
                        loading: false
                    })
                    wx.hideLoading()
                }
            },
            fail:(res)=>{
                this.setData({
                    list: [],
                    loading: false
                })
                wx.hideLoading()
            }
        })
    },
    setList(data) {
        this.totalPages = data.totalPages
        let list = data.items
        if ( !!list && list.length > 0 ) {
            list.forEach((val, i) => {
                val.bt = this.changeTime(val.effectiveAt)
                val.et = this.changeTime(val.expireAt)
                val.class = 'list-warp'
                val.checked = false
                if ( this.data.couponTabType === 'USABLE' || this.data.couponTabType === 'USED' ) {
                    val.usable = true
                } else {
                    val.usable = false
                }
            })
            this.setData({
                list: [].concat(this.data.list, list),
                loading: false
            })
        } else {
            this.setData({
                list: [],
                loading: false
            })
        }
        wx.hideLoading()
    },
    changeTime(date){
        let  myDate =new Date(date) || new Date();
        var myArray =new Array();
        let year=myDate.getFullYear();
        let month =myDate.getMonth()+1;
        let day=myDate.getDate();
        let hour=myDate.getHours();
        let minutes=myDate.getMinutes();
        let seconds=myDate.getSeconds();
        if(month<10){
            month=`0${month}`
        }
        if(day<10){
            day=`0${day}`
        }
        if(hour==0){
            hour='00'
        }else if(hour>0 && hour<10){
            hour=`0${hour}`
        }

        if(minutes==0){
            minutes='00'
        }else if(minutes>0 && minutes<10){
            minutes=`0${minutes}`
        }
        myArray[0] = year;
        myArray[1] = month;
        myArray[2] = day;
        myArray[3] = hour;
        myArray[4] = minutes;
        myArray[5] = seconds;
        return myArray;
    },

    onReachBottom(e) {
        if ( this.totalPages > this.page ) {
            this.page = this.page+1
            if ( this.data.couponTabType === 'SHARE' ) {
                this.getShareList()
            } else {
                this.getList()
            }
        } else {
            console.log('end')
        }
    },

    cardToBack(e) {
        let index = e.target.dataset.index || e.currentTarget.dataset.index
        let list = this.data.list
        if ( list[index].class.indexOf('select') > -1 ) {
            list[index].class = 'list-warp'
        } else {
            list[index].class = 'list-warp select'
        }
        this.setData({
            list: list
        })
    },
    cardToFront(e) {
        let index = e.target.dataset.index || e.currentTarget.dataset.index
        let list = this.data.list
        if ( list[index].class.indexOf('select') > -1 ) {
            list[index].class = 'list-warp'
        } else {
            list[index].class = 'list-warp select'
        }
        this.setData({
            list: list
        })
    },
    changeCard() {
        this.setData({
            changeShow: true
        })
    },
    changeCardCancel() {
        let list = this.data.list
        list.forEach((val, i) => {
            val.checked = false
        })
        this.shareNo = ''
        this.couponIds = []
        this.couponAmount = ''
        this.setData({
            changeShow: false,
            shardModal: false,
            couponIds: [],
            list: list
        })
    },
    selectTab(e) {
        if ( !this.data.changeShow ) return
        let obj = e.target.dataset.content || e.currentTarget.dataset.content
        let index = e.target.dataset.index || e.currentTarget.dataset.index
        let list = this.data.list
        if ( !!list[index].checked ) {
            this.couponIds.forEach((val, i) => {
                if ( val === obj.id) {
                    this.couponIds.splice(i, 1)
                    list[index].checked = false
                }
            })
        } else {
            this.couponIds.push(obj.id)
            list[index].checked = true
        }
        this.setData({
            couponIds: this.couponIds,
            list: list
        })
    },
    getShareForwarding() {
        if ( this.couponIds.length == 0 ) return
        wx.showLoading({
            mask: true
        });
        app.getRequest({
            url:app.globalData.KrUrl+'api/gateway/krcoupon/share/forwarding',
            method: "post",
            data: {
                couponIds: this.couponIds.join(',')
            },
            success:(res)=>{
                this.shareNo = res.data.data.shareNo
                this.couponAmount = res.data.data.couponAmount
                this.setData({
                    shardModal: true
                })
                wx.hideLoading()
            },
            fail:(res)=>{
                wx.hideLoading()
            }
        })
    },
    closeShardModal() {
        this.setData({
            shardModal: false
        })
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 赠送给你300元礼品券，快来领取呀~
            return {
                title: '赠送给你'+this.couponAmount+'元礼品券，快来领取呀~',
                path: 'pages/getCoupon/getCoupon?shareNo='+this.shareNo,
                imageUrl:'../images/coupon/share-bg.jpg',
                success:(res) => {
                    this.changeCardCancel()
                },
                fail:(res) => {
                    this.changeCardCancel()
                }
            }
        } else {
            return app.globalData.share_data
        }
    },
})
