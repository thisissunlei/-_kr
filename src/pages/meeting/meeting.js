//index.js
//获取应用实例
import {dateData,dateDataPrice} from '../../utils/dateData.js';
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
    add_btn : 'true'
  },
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  james:'',
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  dateBtn : function (e){
      let evlue = this.james.dateBtn(e);
      //console.log(evlue)
      //console.log(this.date_data1)
        this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2,         
        });
     
  },

  // function(e){
    
  //   if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
  //     console.log(e);
  //     const new_data = this.data[e.target.dataset.data];
  //     var old_data = [];
  //     if(this.last_data!='false'){
  //       if(this.last_data=='date_data1'){
  //         old_data = this.data['date_data1'];
  //         old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
  //         this.setData({
  //           date_data1:old_data
  //         });
  //       }else if(this.last_data=='date_data2'){
  //         old_data = this.data['date_data2'];
  //         old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
  //         this.setData({            
  //           date_data2:old_data
  //         });
  //       }
  //     }     
  //     new_data[parseInt(e.target.dataset.num)]['type'] = 'active ' + new_data[parseInt(e.target.dataset.num)]['type'];
  //     if(e.target.dataset.data=='date_data2'){
  //       this.setData({
  //         date_data2:new_data,         
  //       });
  //     }else if(e.target.dataset.data=='date_data1'){
  //       this.setData({
  //         date_data1:new_data,        
  //       });
  //     }
  //     this.last_btn_num = e.target.dataset.num;
  //     this.last_data = e.target.dataset.data;  
     



  //   }
  // },
  dealDate:function(today_month,bool){
    const week = today_month.getDay();
    const today = parseInt(new Date().getDate());
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;
    const data = [];
    for (var i = 0; i < day_num; i++) {
      switch (true){
        case i<week:
          data.push({
            value:''
          });
          break;
        case i>(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              type:'next'
            });
          }
          
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              type:'before'
            });
          }else{
            data.push({
              value:'今天',
              type:'now'
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              type:'before'
            });
          }else{
            data.push({
              value:'明天',
              type:'now'
            });
          }
          
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              type:'before'
            });
          }else{
            data.push({
              value:i-week+1,
              type:'next'
            });
          }
  
          break;
        default:
          data.push({
            value:i-week+1,
            type:'before'
          });
          //this.all_day_num++;
        }
      }
    return data;
    
  },

  reduceNum:function(){
    const reduce_btn_f = this.james.reduceNum();
    this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2,
          add_btn :  reduce_btn_f     
        });
  },
  addNum:function(){
    const add_btn_f = this.james.addNum();
    this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2, 
          add_btn :  add_btn_f       
        });
  },
  onLoad: function () {
    let that = this;
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    app.getRequest({
     url:app.globalData.KrUrl+"api/gateway/krseat/seat/goods/list",
     methods:"GET",
     data:{
      seatId:2
     },
     success:res=>{
      //console.log(dateData,res,new dateDataPrice(res.data.data))


        that.james = new dateDataPrice({
            //btn_bool:true,
            data:res.data.data,
            init_data:{
              last_btn_num:22,
              last_data:'date_data1',        
            },
          });
        this.date_data1 = that.james.date_data1;
        this.date_data2 = that.james.date_data2; 
     
        this.setData({
          date_data1:this.date_data1,
          date_data2:this.date_data2,
          date_now:{
            month:today_date.getMonth()+1,
            year:today_date.getFullYear(),
            value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月',
            choose:''
          },
          date_next:{
            month:today_date.getMonth()+2,
            year:today_date.getFullYear(),
            value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月',
            choose:''
          }
        });

      }
    })
    

    
  }
  
})