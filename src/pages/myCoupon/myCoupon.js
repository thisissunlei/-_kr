//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        list: [],
        list2: [{id: 10, state: true, price: 50}, {id: 11, state: true, price: 888}, {id: 12, state: false, price: 1000}],
        couponTabType: 'USABLE',
        page: 1,
        number: 0,
        loading: true
    },
    totalPages: 10,
    onShow: function () {
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        this.getList()
    },
    couponTab(e) {
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        this.setData({
            list: [],
            couponTabType: e.currentTarget.dataset.type,
            page: 1,
            number: e.currentTarget.dataset.number,
            loading: true
        },() => {
            if ( e.currentTarget.dataset.type === 'SHARE' ) {
                this.getShareList()
            } else {
                this.getList()
            }
        })
    },
    getList() {
        wx.hideLoading()
        let res = {
            data: {
                data: [{
                    "conditionDesc": "使用规则描述", // 使用规则描述
                    "couponName": "优惠券名称", // 优惠券名称
                    "effectiveAt": "测试内容3r11", // 生效时间
                    "expireAt": "测试内容j62c", // 过期时间
                    "faceValue": 50, // 面值
                    "id": 84534,
                    "instructions": "去使用去使用去使用去使用去使用去使用去使用去使用去使用去使用去使用" // 使用说明
                },{
                    "conditionDesc": "使用规则描述", // 使用规则描述
                    "couponName": "优惠券名称", // 优惠券名称
                    "effectiveAt": "测试内容3r11", // 生效时间
                    "expireAt": "测试内容j62c", // 过期时间
                    "faceValue": 150, // 面值
                    "id": 84534,
                    "instructions": "去使用去使用去使用去使用去使用去使用去使用去使用去使用去使用去使用" // 使用说明
                }]
            }
        }
        res.data.data.forEach((val, i) => {
            if ( i == 1 ) {
                val.detailShow = true
                val.state = false
            } else {
                val.detailShow = false
                val.state = true
            }
        })
        let list = [].concat(this.data.list,res.data.data)
        this.setData({
            list: list,
            loading: false
        })
    },
    getShareList() {
        wx.hideLoading()
    },
    onReachBottom(e) {
        if ( this.totalPages > this.data.page ) {
            this.setData({
                page: this.data.page+1
            },() => {
                if ( this.data.couponTabType === 'SHARE' ) {
                    this.getShareList()
                } else {
                    this.getList()
                }
            })
        } else {
            console.log('end')
        }
    },


    detailShow(e) {
        let list = this.data.list
        list[e.currentTarget.dataset.index*1].detailShow = !list[e.currentTarget.dataset.index*1].detailShow
        this.setData({
            list: list
        })
    }
})
