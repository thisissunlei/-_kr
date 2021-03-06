const app = getApp()

//新建散座订单--开始
var getSeatData = function(that,num) {
	let seat = {}
	wx.getStorage({
		key: 'create_seat',
		success: function(res) {
			if (res.data) {
				createSeat(res.data,that,num)
			}
		}
	})
}
var createSeat = function(data,that,num) {
	let _this = that;
	app.getRequest({
		// 散座	
		url: app.globalData.KrUrl + 'api/gateway/kmorder/seat/create',
		methods: "GET",
		header: {
			'content-type': "appication/json"
		},
		data: data.create_seat,
		success: (res) => {
			let code = res.data.code;
			let rsData = res.data.data.wxPaySignInfo;
			switch (code){
        case -1:
          //生成订单失败
          _this.setData({
            phoneError: false,
            errorMessage: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              phoneError: true,
              errorMessage: ''
            })
          }, 2000)
          break;
        case -4:
        //优惠券失效
          _this.setData({
            phoneError: false,
            errorMessage: res.data.message
          },function(){
            console.log('优惠券失效======>',res.data.message)
          })
          setTimeout(function () {
            _this.setData({
              phoneError: true,
              errorMessage: ''
            })
          }, 2000)
          break;
        case 2:
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
          break;
        case 1:
          //订单创建成功
          weChatPaySeat(rsData,_this,num)
          wx.setStorage({
              key:"create_seat",
              data:{}
          })
          break;
        default:
          _this.setData({
            phoneError: false,
            errorMessage: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              phoneError: true,
              errorMessage: ''
            })
          }, 2000)
          break;

      }
		},
		fail: (res) => {
		}

	})
}
var weChatPaySeat = function(data,_this,num){
    let id = data.orderId;
    let that = _this;
    app.getRequest({
      url: app.globalData.KrUrl + 'api/gateway/krseat/order/pay',
      methods: "GET",
      data: {
        orderId: id
      },
      success: (res) => {
        if (res.data.code > 0) {
          wx.requestPayment({
            'timeStamp': res.data.data.timestamp,
            'nonceStr': res.data.data.noncestr,
            'package': res.data.data.packages,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            success: function(res) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function() {
                wx.navigateTo({
                  url: '../orderseatDetail/orderseatDetail?id=' + id + '&con=1'
                })
              }, 2000)
            },
            fail: function(res) {
              wx.navigateTo({
                url: '../orderseatDetail/orderseatDetail?id=' + data.orderId + '&con=1'
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../orderseatDetail/orderseatDetail?id=' + data.orderId + '&con=1'
          })
        }
      },
      fail: (res) => {
        // wx.navigateBack({
        //   delta: num
        // })
      }
    })
}

// 新建散座订单--结束

// 新建会议室订单--开始
var getOrderData = function(_this,num){
    wx.getStorage({
      key: 'create_order',
      success: function(res) {
        if(res.data){
          createOrder(res.data,_this,num)
        }
      }
    })
}
var createOrder = function(create_order,_this,num){
    let that = _this;
    let orderData = create_order;
    console.log('createOrder')
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/kmorder/meeting/create',
        methods:"GET",
        header:{
            'content-type':"appication/json"
        },
        data:orderData.create_order,
        success:(res)=>{
            let code=res.data.code;
            let rsData = res.data.data.wxPaySignInfo;
            if(code==-1){
              	that.setData({
	                phoneError:false,
	                success:false,
	                errorMessage:res.data.message
              	})
            	setTimeout(function(){
                that.setData({
                  	phoneError:true,
                  	errorMessage:'',
                })
            	},2000)
            }else if(code === 2){
            // 使用优惠券后，价格为0
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '../orderDetail/orderDetail?id=' + res.data.data.orderId + '&con=' + 1
                })
                wx.hideLoading();
              }, 500)
              
            }else{
              weChatPay(rsData,that,num)
            }
        },
        fail:(res)=>{
          // navBack(num)
        }
    })  
}
var weChatPay = function(data,_this,num){
    let id = data.orderId;
    let that = _this;
    app.getRequest({
        url:app.globalData.KrUrl+'api/gateway/krmting/order/pay',
        methods:"GET",
        data:{
          orderId:id
        },
        success:(res)=>{
        console.log('res',res)
        	if(res.data.code>0){
	            wx.requestPayment({
	              'timeStamp': res.data.data.timestamp,
	              'nonceStr': res.data.data.noncestr,
	              'package': res.data.data.packages,
	              'signType':res.data.data.signType,
	              'paySign': res.data.data.paySign,
	              success:function(res){
	                wx.showLoading({
	                  title: '加载中',
	                  mask:true
	                })
      				    wx.setStorage({
      				      key:"order_pay",
      				      data:{}
      				    })
      				    wx.setStorage({
      				      key:"create_order",
      				      data:{}
      				    })
	                setTimeout(function(){
	                  getInviteeId(id)
	                },2000) 
	              },
	              fail:function(res){
	                  wx.navigateTo({
	                    url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
	                  })
	              }
	            })
        	}else{
                wx.navigateTo({
                  url: '../orderDetail/orderDetail?id='+data.orderId+'&con=1'
                })
        	}
        },
        fail:(res)=>{
          // navBack(num)
        }
    })
}

var getInviteeId = function(orderId){
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krmting/order/invitee',
      methods:"GET",
      header:{
        'content-type':"appication/json"
      },
      data:{
        orderId:orderId
      },
      success:(res)=>{
          wx.navigateTo({
            url: '../paySuccess/paySuccess?inviteeId='+res.data.data.inviteeId
          })
      }
    })
    
}
// 新建会议室订单--结束
var navBack = function(_this,num){
  wx.navigateBack({
      delta: num
    })
}
// 团队卡 -- 下单
var getGoodsData = function (_this) {
    wx.getStorage({
        key: 'goods_order',
        success: function(res) {
            if(res.data){
                goodsOrder(res.data,_this)
            }
        }
    })
}
var goodsOrder = function (goods_order,_this) {
    app.getRequest({
        url: app.globalData.KrUrl + "api/gateway/kmteamcard/create-order",
        methods: "GET",
        header:{
            'content-type':"appication/json"
        },
        data: goods_order.goods_order,
        success: res => {
            if ( res.data.code === -1 ) {} else if ( res.data.code === -2 ) {
                // 未绑定手机号
                wx.navigateTo({
                    url: '../bindPhone/bindPhone?fun=getGoodsData'
                })
            } else {
                wx.requestPayment({
                    nonceStr: res.data.data.wxPaySignInfo.noncestr,
                    orderId: res.data.data.wxPaySignInfo.orderId,
                    package: res.data.data.wxPaySignInfo.packages,
                    paySign: res.data.data.wxPaySignInfo.paySign,
                    signType: res.data.data.wxPaySignInfo.signType,
                    timeStamp: res.data.data.wxPaySignInfo.timestamp,
                    success: (response) => {
                        wx.setStorage({
                            key: "goods_order_ok",
                            data: {
                                state: 'ok',
                                orderId: res.data.data.orderId
                            },
                        })
                        backCard()
                    },
                    fail: (response) => {
                        wx.setStorage({
                            key: "goods_order_ok",
                            data: {
                                state: 'no',
                                orderId: res.data.data.orderId
                            },
                        })
                        backCard()
                    },
                })
            }

        },
        fail: res => {
            wx.setStorage({
                key: "goods_order_ok",
                data: {
                    state: 'no'
                },
            })
            backCard()
        }
    });
}
//返回团队卡页面
var backCard = function(){
  wx.navigateTo({
    url: '../teamCardPurchase/teamCardPurchase'
  })
}

const goStorageUrl = () => {
  setTimeout(() => {
    wx.getStorage({
      key: 'bind_phone_url',
      success: function(res) {
        if (res.data) {
          wx.redirectTo({
            url: res.data || '../index/index'
          })
        }
      }
    })
  }, 1000);
};

module.exports = {
    getSeatData:getSeatData,
    navBack:navBack,
    getOrderData:getOrderData,
    getGoodsData: getGoodsData,
    goStorageUrl
}