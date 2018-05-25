//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  all_day_num:0,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  dateBtn :function(e){
    if(e.target.dataset.bool=='class2'||e.target.dataset.bool=='class3'){
          console.log(e.target.dataset.value,e.target.dataset.bool,e.target.dataset.month,e.target.dataset.year)

    }
  },
  dealDate:function(today_month,bool){
    const week = today_month.getDay();
    const today = parseInt(new Date().getDate());
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;
    const data = [];
    for (var i = 0; i < day_num; i++) {
      console.log(this.all_day_num,i<(30-this.all_day_num),!bool)
      switch (true){
        case i<week:
          data.push({
            value:''
          });
          break;
        case i>(today+1)&&bool:
          data.push({
            value:i-week+1,
            type:'class2'
          });
          this.all_day_num++;
          break;
        case i==today&&bool:
          data.push({
            value:'今天',
            type:'class3'
          });
          this.all_day_num++;
          break;
        case (i==(today+1))&&bool:
          data.push({
            value:'明天',
            type:'class3'
          });
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
        
          data.push({
            value:i-week+1,
            type:'class2'
          });
          break;
        default:
          data.push({
            value:i-week+1,
            type:'class1'
          });
          //this.all_day_num++;
        }
      }
      /*if(i<week){
        
      }else if(){
        
      }else if(){
        
      }else if(i==(today+1)&&bool){
        data.push({
          value:'明天',
          type:'class3'
        });
      }else{
        data.push({
          value:i,
          type:'class2'
        });
      }
    }*/
    return data;
    
  },


  onLoad: function () {
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    const date1 = this.dealDate(today_month,true);
    const date2 = this.dealDate(next_month,false); 
    console.log(date1)
    this.setData({
      date_data1:date1,
      date_data2:date2,
      date_now:{
        month:today_date.getMonth()+1,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月'
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月'
      }
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
