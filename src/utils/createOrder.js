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
		url: app.globalData.KrUrl + 'api/gateway/krseat/seat/order/create',
		methods: "GET",
		header: {
			'content-type': "appication/json"
		},
		data: data.create_seat,
		success: (res) => {
			let code = res.data.code;
			let rsData = res.data.data;
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
			wx.navigateBack({
				delta: num
			})
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
          if (!wx.getStorageSync("order-info")) {
            let orderArr = []
            console.log(typeof res.data.data, res.data.data, orderArr, res.data, 333333)
            orderArr.push(res.data.data)
            wx.setStorageSync("order-info", orderArr)
            wx.setStorageSync("order", res.data.data)
          } else {
            let orderseat = wx.getStorageSync("order-info")
            console.log(typeof res.data.data, res.data.data, orderseat, res.data, 44444)
            orderseat.push(res.data.data)
            wx.setStorageSync("order-info", orderseat)
            wx.setStorageSync("order", res.data.data)
          }
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
                  url: '../orderseatDetail/orderseatDetail?id=' + id + '&con=' + 1
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
        wx.navigateBack({
          delta: num
        })
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
        url:app.globalData.KrUrl+'api/gateway/krmting/order/create',
        methods:"GET",
        header:{
            'content-type':"appication/json"
        },
        data:orderData.create_order,
        success:(res)=>{
            let code=res.data.code;
            let rsData = res.data.data;
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
          navBack(num)
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
          navBack(num)
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
var navBack = function(num){
  wx.navigateBack({
      delta: num
    })
}
module.exports = {
    getSeatData:getSeatData,
    navBack:navBack,
    getOrderData:getOrderData
}