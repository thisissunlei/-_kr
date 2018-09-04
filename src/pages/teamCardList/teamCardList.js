//获取应用实例
const app = getApp();
Page({
  data: {
    list: [],
    loading: false,
    imgUrl: app.globalData.KrImgUrl
  },
  cardList: [{
    cardNo: 'NO.123456789',
    effectAt: '2018.09.10',
    expireAt: '2019.09.09',
    remainAmountDecimal: '5,000',
    name: '速战速决闪卡速决闪卡',
    cardId: 1
  }, {
    cardNo: 'NO.123456',
    effectAt: '2018.09.10',
    expireAt: '2019.09.09',
    remainAmountDecimal: '5,000',
    name: '速战速决闪卡2',
    cardId: 2
  }, {
    cardNo: 'NO.123456',
    effectAt: '2018.09.10',
    expireAt: '2019.09.09',
    remainAmountDecimal: '5,000',
    name: '速战速决闪卡3',
    cardId: 3
  }, {
    cardNo: 'NO.123456',
    effectAt: '2018.09.10',
    expireAt: '2019.09.09',
    remainAmountDecimal: '5,000',
    name: '速战速决闪卡4',
    cardId: 4
  }, ],
  checked: {},
  back: true,
  onLoad: function(options) {
    this.from = options.from;
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    this.checked = {
      card: true,
      cardNo: 'NO.123456',
      effectAt: '2018.09.10',
      expireAt: '2019.09.09',
      remainAmountDecimal: '5,000',
      name: '速战速决闪卡1',
      cardId: 1
    }

    // 假数据
    let list = this.cardList.map((val, i) => {
      val.bt = this.changeTime(val.effectiveAt)
      val.et = this.changeTime(val.expireAt)
      val.class = 'list-warp'

      if (!!this.checked.card) {
        if (val.cardId === this.checked.cardId) {
          val.checked = true
        } else {
          val.checked = false
        }
      } else {
        val.checked = false
      }
      return val
    })
    wx.hideLoading()
    this.setData({
      list: list,
      loading: false
    })
    return
    // 假数据结束



    if (options.from === 'seat') {
      wx.getStorage({
        key: 'seat_order_card',
        success: (res) => {
          this.checked = res.data
          this.getSeatList()
        },
        fail: (res) => {
          this.checked = {
            sale: false
          }
          this.getSeatList()
        }
      })

    } else {
      wx.getStorage({
        key: 'meeting_order_card',
        success: (res) => {
          this.checked = res.data
          this.getMeetList()
        },
        fail: (res) => {
          this.checked = {
            sale: false
          }
          this.getMeetList()
        }
      })
    }
  },
  jumpBuyCard() {

  },
  getMeetList() {
    wx.getStorage({
      key: 'meeting_sale',
      success: (res) => {
        if (res.data) {
          this.getList(res.data, 'api/gateway/krcoupon/meeting/is-first-order')
        }
      }
    })
  },
  getSeatList() {
    wx.getStorage({
      key: 'seat-sale',
      success: (res) => {
        if (res.data) {
          this.getList(res.data, 'api/gateway/kmorder/seat/coupon-teamcard-list')
        }
      }
    })

  },
  getList(data, url) {
    app.getRequest({
      url: app.globalData.KrUrl + url,
      method: "get",
      data: data,
      success: (res) => {
        if (res.data.code > 0) {
          let list = res.data.data.coupons
          list.forEach((val, i) => {
            val.bt = this.changeTime(val.effectAt)
            val.et = this.changeTime(val.expireAt)
            val.class = 'list-warp'

            if (!!this.checked.sale) {
              if (val.couponId === this.checked.id) {
                val.checked = true
              } else {
                val.checked = false
              }
            } else {
              val.checked = false
            }
          })
          this.setData({
            list: list,
            loading: false
          })
        }
        wx.hideLoading()
      },
      fail: (res) => {
        wx.hideLoading()
      }
    })
  },
  changeTime(date) {
    let myDate = new Date(date) || new Date();
    var myArray = new Array();
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let hour = myDate.getHours();
    let minutes = myDate.getMinutes();
    let seconds = myDate.getSeconds();
    if (month < 10) {
      month = `0${month}`
    }
    if (day < 10) {
      day = `0${day}`
    }
    if (hour == 0) {
      hour = '00'
    } else if (hour > 0 && hour < 10) {
      hour = `0${hour}`
    }

    if (minutes == 0) {
      minutes = '00'
    } else if (minutes > 0 && minutes < 10) {
      minutes = `0${minutes}`
    }
    myArray[0] = year;
    myArray[1] = month;
    myArray[2] = day;
    myArray[3] = hour;
    myArray[4] = minutes;
    myArray[5] = seconds;
    return myArray;
  },


  notUse: function() {
    if (!this.back) return
    wx.showLoading({
      mask: true
    })
    this.back = false
    if (this.from == "seat") {
      wx.getStorage({
        key: 'seat_sale_info',
        success: function(res) {
          let data = res.data;
          data.card = obj;
          wx.setStorage({
            key: "seat_sale_info",
            data: data,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)

            }
          })
        }
      })
    } else if (this.from == "meeting") {
      wx.setStorage({
        key: "meeting_order_card",
        data: {
          sale: false
        },
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 500)

        }
      })
    }

  },
  selectTab: function(e) {
    let obj = e.target.dataset.content || e.currentTarget.dataset.content;
    let index = e.target.dataset.index || e.currentTarget.dataset.index;
    if (!this.back) return
    wx.showLoading({
      mask: true
    })
    this.back = false
    let list = this.data.list
    list.forEach((val, i) => {
      val.checked = false
    })
    list[index].checked = true
    this.setData({
      list: list
    })
    obj.card = true;
    if (this.from == "seat") {
      wx.getStorage({
        key: 'seat_sale_info',
        success: function(res) {
          let data = res.data;
          data.card = obj;
          wx.setStorage({
            key: "seat_sale_info",
            data: data,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)

            }
          })
        }
      })
    } else if (this.from == "meeting") {
      wx.getStorage({
        key: 'meeting_order_sale',
        success: function(res) {
          let data = res.data;
          data.card = obj;
          console.log('data',data)
          wx.setStorage({
            key: "meeting_order_sale",
            data: data,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)

            }
          })
        }
      })
     
    }
  }
});