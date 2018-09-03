const app = getApp()

//新建散座订单
var getSeatData = function(this) {
	let seat = {}
	wx.getStorage({
		key: 'myorder',
		success: function(res,this) {
			if (res.data) {
				createSeat(res.data)
			}
		}
	})
}
var createSeat = function(data,this) {
	let that = this;
	app.getRequest({
		// 散座	
		url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/create',
		methods: "GET",
		header: {
				'content-type': "appication/json"
		},
		data: data,
		success: (res) => {
			let code = res.data.code;
			let rsData = res.data.data;
			if (code == -1) {
				that.setData({
					phoneError: false,
					success: false,
					errorMessage: res.data.message
				})
				setTimeout(function() {
					that.setData({
						phoneError: true,
						errorMessage: '',
					})
					wx.navigateTo({
						url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
					})
				}, 2000)
			} else if (code === 2) {
				// 使用优惠券后，价格为0
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				setTimeout(function() {
					wx.navigateTo({
						url: '../orderseatDetail/orderseatDetail?id=' + res.data.data.orderId + '&con=' + 1
					})
					wx.hideLoading();
				}, 500)

			} else {
				// that.weChatPay(rsData)
				// that.clearStorage()
			}

		},
		fail: (res) => {
			wx.navigateBack({
				delta: 2
			})
		}

	})
}