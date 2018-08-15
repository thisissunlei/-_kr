//获取应用实例
const app = getApp();
Page({
  data: {
    list:[],
  },
  onLoad: function (options) {
      this.from=options.from;
      // let list = [{"usable":true,"amount":50,"couponName":"第4批","quata":6,"ruleType":"FULL_REDUCTION","effectiveAt":1534242977000,"conditionDesc":"满60.0使用","couponId":17,"expireAt":1534991489000,"usageType":"ANY"},{"usable":false,"amount":10,"couponName":"第3批","quata":2,"ruleType":"FULL_REDUCTION","effectiveAt":1533350133000,"conditionDesc":"满20.0使用","couponId":18,"expireAt":1535077888000,"usageType":"ANY"}]
      // list.forEach((val, i) => {
      //     val.bt = this.changeTime(val.effectiveAt)
      //     val.et = this.changeTime(val.expireAt)
      //     val.class = 'list-warp'
      // })
      // this.setData({
      //     list: list
      // })
      if ( options.from === 'seat' ) {
          this.getSeatList()
      } else {
          this.getMeetList()
      }
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
                    this.getList(res.data, 'api/gateway/krcoupon/seat/is-first-order')
                }
            }
        })

    },
    getList(data, url) {
        app.getRequest({
            url:app.globalData.KrUrl+url,
            method:"get",
            data: data,
            success:(res)=>{
                if ( res.data.code > 0 ) {
                    let list = res.data.data.coupons
                    list.forEach((val, i) => {
                        val.bt = this.changeTime(val.effectiveAt)
                        val.et = this.changeTime(val.expireAt)
                        val.class = 'list-warp'
                    })
                    this.setData({
                        list: list
                    })
                }
            },
            fail:(res)=>{}
        })
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
    cardToBack(e) {
        let index = e.target.dataset.index || e.currentTarget.dataset.index
        let list = this.data.list
        list[index].class = 'list-warp select'
        this.setData({
            list: list
        })
    },
    cardToFront(e) {
        let index = e.target.dataset.index || e.currentTarget.dataset.index
        let list = this.data.list
        list[index].class = 'list-warp'
        this.setData({
            list: list
        })
    },


  notUse:function(){
    if(this.from=="seat"){
        wx.setStorage({
          key:"seat_order_sale",
          data:{sale:false},
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },500)
            
          }
        })
    }else if(this.from=="meeting"){
        wx.setStorage({
          key:"meeting_order_sale",
          data:{sale:false},
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },500)
            
          }
        })
    }
    
  },
  selectTab:function(e){
    let obj = e.target.dataset.content || e.currentTarget.dataset.content;
    if ( !obj.usable ) return
    obj.sale = true;
    obj.reduce = obj.amount;
    obj.id = obj.couponId;
    if(this.from=="seat"){
        wx.setStorage({
            key: "seat_order_sale",
            data: obj,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },500)
              
            }
          })
    }else if(this.from=="meeting"){
      wx.setStorage({
        key:"meeting_order_sale",
        data:obj,
        success:function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
          
        }
      })
  }
  }
});
