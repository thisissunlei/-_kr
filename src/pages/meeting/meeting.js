//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    id:0,
    show_a:false,
    fan:'',
    zheng:true,
    Minimum:null,
    Maximum:null,
    inn:[],//最终数组
    inn1:[],
    splice:[],//暂存数组
    splice_s:[],
    combination:[],
    index1:new Date().getDate(),
    number:1,
    show:false,
    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    date_data1:[],
    date_data2:[],
    date_now:{month:'',year:'',value:''},
    date_next:{month:'',year:'',value:''},
    arr:[
      {goodsId: 134, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 0.01},
      {goodsId: 135, promotionCost: 0.01, remainQuantity: 69, seatId: 1, unitCost: 0.01},
      {goodsId: 136, promotionCost: 0.01, remainQuantity: 69, seatId: 1, unitCost: 0.01},
      {goodsId: 137, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 138, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 139, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 140, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 141, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 142, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 143, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 144, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 145, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 146, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 147, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 148, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 149, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 150, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 151, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 152, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 153, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 154, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 155, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 156, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 157, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 158, promotionCost: 0.01, remainQuantity: 99, seatId: 1, unitCost: 1},
      {goodsId: 159, promotionCost: 333, remainQuantity: 99, seatId: 1, unitCost: 23},
      {goodsId: 160, promotionCost: 333, remainQuantity: 99, seatId: 1, unitCost: 23},
      {goodsId: 161, promotionCost: 333, remainQuantity: 99, seatId: 1, unitCost: 23},
      {goodsId: 162, promotionCost: 333, remainQuantity: 99, seatId: 1, unitCost: 23},
      {goodsId: 163, promotionCost: 333, remainQuantity: 99, seatId: 1, unitCost: 23}
    ],
  },
 arr_index:[],
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  diantrue(){
    let fuxiu = []
    let fuxiu_a = []
    this.data.date_data1.map((item,index)=>{
      if(item.kg == true){
        fuxiu.push(item)
      }
    })
    this.data.date_data2.map((item,index)=>{
      if(item.kg == true){
        fuxiu_a.push(item)
      }
    })
    console.log(fuxiu,fuxiu_a)
    let combination = fuxiu.concat(fuxiu_a)
    combination.map(item=>{
      item.number_a = this.data.number
    })
    console.log(combination)
    this.setData({
      combination:combination
    })
    wx.setStorageSync('data-index',this.data.combination)
    console.log(this.data.id)
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/list',
      methods:"GET",
      data:{
        seatId:this.data.id
      },
      success:res=>{
        console.log(res)
        let ss = this.data.id
        setTimeout(function(){
          wx.navigateTo({
            url:"/pages/seatorderConfirmation/seatorderConfirmation?id="+ss
          })
            },0)

      }
    })
  },
  fanshow(){
    wx.navigateTo({
      url:"../seatorderConfirmation/seatorderConfirmation"
    })
  },
  jian(){
    if(this.data.number > 1){
      this.setData({
        number:this.data.number-=1
      })
    }
    let arr_a_a = this.data.date_data1
    let arr_a_a2 = this.data.date_data2
    let edge = []
    arr_a_a.map((item,index)=>{
        if(item.number >= this.data.number){
          item.type = 'next'
          this.setData({
            date_data1:arr_a_a
          })
        }
        if(item.kg == true){
          edge.push(item)
        }
    })
    arr_a_a2.map((item,index)=>{
      if(item.number >= this.data.number){
        item.type = 'next'
        this.setData({
          date_data2:arr_a_a2
        })
      }
      if(item.kg == true){
        edge.push(item)
      }
    })
    edge.sort(function(a,b){
      return a.number - b.number//从小到大
    })
    console.log(edge)
    if(edge.length == 0){
      this.setData({
        date_data1:arr_a_a,
        date_data2:arr_a_a2,
        zheng:true
      })
    }else{
      this.setData({
        date_data1:arr_a_a,
        date_data2:arr_a_a2,
        Maximum:edge[edge.length-1].number,
        Minimum:edge[0].number
      })
      if(this.data.number < this.data.Maximum){
        let da = this.data.Maximum
        this.setData({
          zheng:true
        })
        console.log(this.data.number)
      }else{
        this.setData({
          zheng:false
        })
      }
    }
    console.log(this.data.number,this.data.Maximum)
    
    console.log('最大是'+this.data.Maximum,'最小是'+this.data.Minimum)
    // console.log(this.data.Maximum,this.data.Minimum,this.data.number)
    // if(this.data.number <= this.data.Minimum){
    //   this.setData({
    //     number : this.data.Minimum
    //   })
    //   arr_a_a.map(item=>{
    //     if(item.number < this.data.number){
    //       item.type = 'before'
    //     }
    //   })
    //   arr_a_a2.map(item=>{
    //     if(item.number < this.data.number){
    //       item.type = 'before'
    //       console.log(item)
    //     }
    //   })
    //   this.setData({
    //     date_data1:arr_a_a,
    //     date_data2:arr_a_a2
    //   })
    // }
  },
  jia(){
      this.setData({
        number:this.data.number+=1
      })
    
    let arr_a_a = this.data.date_data1
    let arr_a_a2 = this.data.date_data2
    let edge_a = []
    arr_a_a.map((item,index)=>{
      if(item.number < this.data.number){
        item.kg = false
        item.type = 'before'
      }
      if(item.kg == true){
        edge_a.push(item)
      }
      return item;
    })
    this.setData({
      date_data1:arr_a_a
    })
    arr_a_a2.map((item,index)=>{
      if(item.number < this.data.number){
        item.kg = false
        item.type = 'before'
      }
      if(item.kg == true){
        edge_a.push(item)
      }
      return item;
    })
    console.log(edge_a)
    edge_a.sort(function(a,b){
      return a.number - b.number//从小到大
    })
    if(edge_a.length == 0){
      this.setData({
        date_data2:arr_a_a2,
        zheng:true
      })
    }else{
        this.setData({
          date_data2:arr_a_a2,
          Maximum:edge_a[edge_a.length-1].number,
          Minimum:edge_a[0].number
        })
        if(this.data.number >= this.data.Maximum){
          let da = this.data.Maximum
          console.log(da)
          this.setData({
            number : da,
            zheng:false
          })
          console.log(this.data.number)
        }else{
          this.setData({
            zheng:true
          })
        }
    }
    
    console.log('最大是'+this.data.Maximum,'最小是'+this.data.Minimum)
    // if(this.data.number >= this.data.Maximum){
    //   this.setData({
    //     zheng:false
    //   })
    // }else if(this.data.Minimum < this.data.number && this.data.number < this.data.Maximum){
    //   this.setData({
    //     zheng:true
    //   })
    // }
    // console.log(this.data.Maximum,this.data.Minimum,this.data.number)
    // if(this.data.number >= this.data.Maximum){
    //   this.setData({
    //     number : this.data.Maximum
    //   })
      // arr_a_a.map(item=>{
      //   if(item.number < this.data.number){
      //     item.type = 'before'
      //   }
      // })
      // arr_a_a2.map(item=>{
      //   if(item.number < this.data.number){
      //     item.type = 'before'
      //     console.log(item)
      //   }
      // })
      // this.setData({
      //   date_data1:arr_a_a,
      //   date_data2:arr_a_a2
      // })
    // }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  arr(x){
    x.map((item,index)=>{
      if(item.kg == false){
        this.setData({
          show:false
        })
      }else{
        this.setData({
          show:true
        })
      }
    })
    return this.data.show
  },
  dateBtn :function(e){
    const today_a = parseInt(new Date().getDate())
    
    console.log(e)
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      // const new_data = this.data[e.target.dataset.data];//遍历的哪条数组
      var old_data = [];
      let aa = e.target.dataset
      let kong_index =this.data.inn
      let kong_index1 =this.data.inn1
      let kong_index_a = this.data.splice
      if(e.target.dataset.data=='date_data2'){
        let ios = this.data.date_data2
        let zuti = e.target.dataset.kg
        let index_zi_a = this.data.arr1
        let inn1 = this.data.inn1
        //------------------
        // const today_date1 = new Date();
        // const next_month = new Date(today_date1.getFullYear(),today_date1.getMonth()+1,1)
        // const week1 = next_month.getDay();//月第一天星期几
        // console.log(week1)
        //----------------------
        
        ios[e.target.dataset.num].kg = !ios[e.target.dataset.num].kg
        index_zi_a[e.target.dataset.num].kg = !index_zi_a[e.target.dataset.num].kg
        this.setData({
          date_data2:ios,
          // date_data2:new_data, 
          arr1:index_zi_a 
        });
        if(e.target.dataset.kg == true){//取消
          console.log("用户取消了")
          // console.log(this.data.date_data1[e.target.dataset.num])//false
          let arr_index = []
          this.data.date_data2.map((item,index)=>{
            if(item.kg == true){
              // console.log(item)
              arr_index.push(item)
            }
          })

          // console.log(arr_index)
          this.setData({
            inn1:arr_index
          })
        }else{//选择
          console.log("用户选择")
          this.data.date_data2.map((item,index)=>{
            if(item.kg == true){
              if(index == e.target.dataset.num){
                let year = e.target.dataset.year, month = e.target.dataset.month-1, date = e.target.dataset.value;// month=6表示7月
            
                console.log(e)
                  let dt = new Date(year, month, date), dt2 = new Date();
                  let weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                  if(date == '今天'){
                    weekDay[dt.getDay()] = '今天'
                  }else if (date == '明天'){
                    weekDay[dt.getDay()] = '明天'
                  }
                // console.log(weekDay[dt.getDay()])
                item.zhou = weekDay[dt.getDay()]
                item.value = e.target.dataset.value
                item.month = e.target.dataset.month
                item.year = e.target.dataset.year
                item.number_a = this.data.number
                item.kg = this.data.date_data2[index].kg
                kong_index1.push(item)
                this.setData({
                  inn1:kong_index1
                })
                console.log(this.data.inn1)
              }
            }
          })
        }
        console.log(this.data.inn1)
      }else if(e.target.dataset.data=='date_data1'){
        console.log(this.data.date_data1)
        let ioi = this.data.date_data1
        let zuti = e.target.dataset.kg
        let index_zi = this.data.arr
        console.log(ioi,index_zi)
        ioi[e.target.dataset.num].kg = !ioi[e.target.dataset.num].kg//true
        index_zi[e.target.dataset.num+1-today_a].kg = !index_zi[e.target.dataset.num+1-today_a].kg
       
        this.setData({
          date_data1:ioi,
          // date_data1:new_data,
          arr:index_zi
        });
        if(e.target.dataset.kg == true){//取消
          console.log("用户取消了")
          // console.log(this.data.date_data1[e.target.dataset.num])//false
          let arr_index = []
          this.data.date_data1.map((item,index)=>{
            if(item.kg == true){
              // console.log(item)
              arr_index.push(item)
            }
          })

          // console.log(arr_index)
          this.setData({
            inn:arr_index
          })
        }else{//选择
          console.log("用户选择")
          this.data.date_data1.map((item,index)=>{
            if(item.kg == true){
              if(index == e.target.dataset.num){
                var year = e.target.dataset.year, month = e.target.dataset.month-1, date = e.target.dataset.value;// month=6表示7月
                
                  var dt = new Date(year, month, date), dt2 = new Date();
                  var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                  if(date == '今天'){
                    weekDay[dt.getDay()] = '今天'
                  }else if (date == '明天'){
                    weekDay[dt.getDay()] = '明天'
                  }
                // console.log(weekDay[dt.getDay()])
                item.zhou = weekDay[dt.getDay()]
                item.value = e.target.dataset.value
                item.month = e.target.dataset.month
                item.year = e.target.dataset.year
                item.number_a = this.data.number
                item.kg = this.data.date_data1[index].kg
                kong_index.push(item)
                this.setData({
                  inn:kong_index
                })
                console.log(this.data.inn)
              }
            }
          })
        }
        // console.log(this.data.inn)
      }
        // if(aa.data == 'date_data1'){}
      this.last_btn_num = e.target.dataset.num;
      this.last_data = e.target.dataset.data;  
      // console.log(e.target.dataset)
    }
    // this.data.arr.map((item,index)=>{
    //   if(item.kg == true){
    //     // console.log(this.data.arr[index])
    //     console.log(item)
    //   }
    // })
  },

  dealDate:function(today_month,bool){
    
   
    let index_zhu = this.data
    const week = today_month.getDay();//月第一天星期几
    const today = parseInt(new Date().getDate());//今天是几号
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;//31天+ 星期三==34
    let fu_arr = this.data.arr
    let fu_arr1 = this.data.arr
    for(let i of fu_arr){
      i.kg = false
    }
    for(let i of fu_arr1){
      i.kg = false
    }
    let new_arr = fu_arr.slice(0,day_num-week-today+1)
    // let new_arr1 = fu_arr.slice(day_num-week-today+1)
    this.setData({
      arr:new_arr
    })
    console.log(this.data.arr,this.data.arr1)
    const data = [];
    for (var i = 0; i < day_num; i++) {
      switch (true){
        case i<week:
          data.push({//不是从星期日开始补零
            value:''
          });
          break;
        case i>(today+week)&&bool:
          if(i%7==0||i%7==6){//本月部分不可选，可能数量不足或买完周六日
            console.log(i,"本月周六")
              data.push({//本月部分不可选，可能数量不足或买完
                value:i-week+1,
                type:'before',
              })
            
          }else{
            console.log(this.data.arr)
            console.log(i-today+1,"可选")
            if(index_zhu.arr[i-today+1].remainQuantity > 1 && index_zhu.number>index_zhu.arr[i-today+1].remainQuantity){
              // index_zhu.arr[i].mary='数量不足'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                number:index_zhu.arr[i-today+1].remainQuantity,
                mary:index_zhu.arr[i-today+1].unitCost,
              });
            }else if(index_zhu.arr[i-today+1].remainQuantity == 0){
              // index_zhu.arr[i].mary='已售完'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                number:index_zhu.arr[i-today+1].remainQuantity,
                mary:index_zhu.arr[i-today+1].unitCost,
              });
            }
            else{
              data.push({
                value:i-week+1,
                type:'next',
                kg:index_zhu.arr[i-today+1].kg,
                number:index_zhu.arr[i-today+1].remainQuantity,
                mary:index_zhu.arr[i-today+1].unitCost
              })
            }
          }
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              type:'before',
            });
          }else{
            console.log(i,'本月今天')
            console.log(i+1-today)
            console.log(index_zhu.arr[i+1-today].remainQuantity)
            if(index_zhu.arr[i+1-today].remainQuantity < index_zhu.number){
              data.push({//今天可选
                value:'今天',
                type:'before',
                kg:false,
                mary:index_zhu.arr[i+1-today].unitCost
              });
            }else{
              data.push({//今天可选
                value:'今天',
                type:'now',
                kg:true,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost
              });
            }
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              type:'before',
              kg:false,
              number:index_zhu.arr[i+1-today].remainQuantity,
              mary:index_zhu.arr[i+1-today].unitCost
            });
          }else{
            if(index_zhu.arr[i+1-today].remainQuantity <= this.data.number || index_zhu.arr[i+1-today].remainQuantity == 0){
              data.push({//本月明天可选
                value:'明天',
                type:'before',
                kg:false,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost
              });
            }else{
              data.push({//本月明天可选
                value:'明天',
                type:'now',
                kg:true,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost
              }); 
            }
            
          }
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){ 
            console.log(i+"下月星期天")
            console.log(this.data.arr1)
            // data.push({//下月部分星期天
            //   value:i-week+1,
            //   type:'before',
            //   // number:index_zhu.arr[i].number,
            //   // mary:index_zhu.arr[i].mary,
            //   name:"周天"
            // });
          }else{
            console.log(i+"本月")
            console.log(this.data.arr1)
            // if(index_zhu.arr1[i].number > 1 && index_zhu.arr1[i].number<index_zhu.number){
            //   data.push({//除周六日可选
            //     value:i-week+1,
            //     type:'before',
            //     number:index_zhu.arr1[i].number,
            //     mary:index_zhu.arr1[i].mary,
               
            //   });
            // }else if(index_zhu.arr1[i].number == 0){
              
            //   // index_zhu.arr1[i].mary='已售完'
            //   data.push({//除周六日可选
            //     value:i-week+1,
            //     type:'before',
            //     number:index_zhu.arr1[i].number,
            //     mary:index_zhu.arr1[i].mary,
            //     name:i
            //   });
            // }else{
              
            //   data.push({
            //     value:i-week+1,
            //     type:'next',
            //     kg:index_zhu.arr1[i].kg,
            //     number:index_zhu.arr1[i].number,
            //     mary:index_zhu.arr1[i].mary
            //   })
            // }
          }
          break;
        default:
          data.push({//已经过去的时间灰色不可选
            value:i-week+1,
            type:'before',
            kg:false
          });
          //this.all_day_num++;
        }
      }
    return data;
    
  },
  // dealNum:function (){
  //   const week = new Date().getDay();
  //   new Date().getDate()
  //   today_month.setMonth(today_month.getMonth() + 1);
  //   today_month.setDate(0);
  //   const day_num = today_month.getDate()+week;
  // 今天+月第一天星期几-1
  //   arr_new
  // },
  onLoad:function(e){
    console.log(e)
    this.setData({
      id:e.id
    })
    
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    
    const date1 = this.dealDate(today_month,true);
    const date2 = this.dealDate(next_month,false);
    this.setData({
      date_data1:date1,
      date_data2:date2,
      date_now:{
        month:today_date.getMonth()+1,//月
        year:today_date.getFullYear(),//年
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+1) + '月',  //年月
        choose:''
      },
      date_next:{
        month:today_date.getMonth()+2,
        year:today_date.getFullYear(),
        value:today_date.getFullYear()+'年'+(parseInt(today_date.getMonth())+2) + '月',
        choose:''
      }
    });
    console.log(this.data.date_data1)
    // console.log(this.data.date_data2)
  }
  
})
