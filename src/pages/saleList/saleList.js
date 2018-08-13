//获取应用实例
const app = getApp();
Page({
  data: {
    saleList:[
      {
        id:1,
        name:'11111',
        reduce:'50',
      },
      {
        id:2,
        name:'122111',
        reduce:'30',
      },
    ],
    from:''
  },
  onLoad: function (options) {
      this.from=options.from;
      console.log('saleList--->',options.from)
  },
  notUse:function(){
    if(this.from=="seat"){
        wx.setStorage({
          key:"seat_order-sale",
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
          key:"meeting_order-sale",
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
    var target = e.target.dataset;
    console.log('selectTab',target.content)
    let obj = target.content;
    obj.sale = true;
    if(this.from=="seat"){
        wx.setStorage({
            key:"seat_order-sale",
            data:obj,
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
        key:"meeting_order-sale",
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
