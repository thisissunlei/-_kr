//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    week:'',
    arr2:[],
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
    arr:[],
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
    // console.log(fuxiu,fuxiu_a)
    let combination = fuxiu.concat(fuxiu_a)
    combination.map(item=>{
      item.number_a = this.data.number
    })
    // console.log(combination)
    this.setData({
      combination:combination
    })
    wx.setStorageSync('data-index',this.data.combination)
    // console.log(this.data.id)
    app.getRequest({
      url:app.globalData.KrUrl+'api/gateway/krseat/seat/goods/list',
      methods:"GET",
      data:{
        seatId:this.data.id
      },
      success:res=>{
        // console.log(res)
        let ss = this.data.id
        setTimeout(function(){
          wx.navigateTo({
            url:"/pages/seatorderConfirmation/seatorderConfirmation?id="+ss
          })
            },0)

      }
    })
  },
  // fanshow(){
  //   wx.navigateTo({
  //     url:"../seatorderConfirmation/seatorderConfirmation"
  //   })
  // },
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
    // console.log(edge)
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
        // console.log(this.data.number)
      }else{
        this.setData({
          zheng:false
        })
      }
    }
    // console.log(this.data.number,this.data.Maximum)
    
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
    // console.log(edge_a)
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
          // console.log(da)
          this.setData({
            number : da,
            zheng:false
          })
          // console.log(this.data.number)
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
    
    console.log(this.data.week)
    const today_a = parseInt(new Date().getDate())
    // console.log(e)
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
        console.log(index_zi_a,ios,e.target.dataset.num)
        let inn1 = this.data.inn1
        //------------------
        // const today_date1 = new Date();
        // const next_month = new Date(today_date1.getFullYear(),today_date1.getMonth()+1,1)
        // const week1 = next_month.getDay();//月第一天星期几
        // console.log(week1)
        //----------------------
        
        ios[e.target.dataset.num].kg = !ios[e.target.dataset.num].kg
        index_zi_a[e.target.dataset.num-this.data.week].kg = !index_zi_a[e.target.dataset.num-this.data.week].kg
        this.setData({
          date_data2:ios,
          // date_data2:new_data, 
          arr1:index_zi_a 
        });
        if(e.target.dataset.kg == true){//取消
          // console.log("用户取消了")
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
          // console.log("用户选择")
          this.data.date_data2.map((item,index)=>{
            console.log(index,e.target.dataset.num)
            if(item.kg == true){
              if(index == e.target.dataset.num){
                let year = e.target.dataset.year, month = e.target.dataset.month-1, date = e.target.dataset.value;// month=6表示7月
            
                // console.log(e)
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
                item.arr = e.target.dataset.data
                item.index = e.target.dataset.num
                item.kg = this.data.date_data2[index].kg
                kong_index1.push(item)
                this.setData({
                  inn1:kong_index1
                })
                // console.log(this.data.inn1)
              }
            }
          })
        }
        // console.log(this.data.inn1)
      }else if(e.target.dataset.data=='date_data1'){
        // console.log(this.data.date_data1)
        let ioi = this.data.date_data1
        let zuti = e.target.dataset.kg
        let index_zi = this.data.arr
        // console.log(ioi,index_zi)
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
          // console.log("用户选择")
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
                item.index = e.target.dataset.num
                item.arr = e.target.dataset.data
                item.number_a = this.data.number
                item.kg = this.data.date_data1[index].kg
                kong_index.push(item)
                this.setData({
                  inn:kong_index
                })
                // console.log(this.data.inn)
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
  test:function(today_month,bool){
    
    console.log(">>>>>>>data>>>>>",this.data.arr)
    let index_zhu = this.data
    const week = today_month.getDay();//月第一天星期几
    this.setData({
      week:week
    })
    const today = parseInt(new Date().getDate());//今天是几号
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;//31天+ 星期三==34
    let fu_arr = this.data.arr
    let fu_arr1 = this.data.arr
    // for(let i of fu_arr){
    //   i.kg = false
    // }
    // for(let i of fu_arr1){
    //   i.kg = false
    // }

    let new_arr = fu_arr.slice(0,day_num-week-today+1)
    // console.log(new_arr)
    let new_arr1 = fu_arr.slice(day_num-week-today+1)
    console.log(new_arr,new_arr1)
    let _this = this
    this.setData({
      arr2:new_arr,
      arr1:new_arr1
    },function(){
      // console.log(_this.data.arr2,_this.data.arr1)
    })
    
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
              data.push({//本月部分不可选，可能数量不足或买完
                value:i-week+1,
                type:'before',
              })
            
          }else{
            console.log(index_zhu.arr[i-today+1],'----------------------------------')
            if(index_zhu.arr[i-today+1].remainQuantity > 1 && index_zhu.number>index_zhu.arr[i-today+1].remainQuantity){
              // index_zhu.arr[i].mary='数量不足'
              // console.log("数量不足")
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                id:index_zhu.arr[i-today+1].goodsId,
                number:index_zhu.arr[i-today+1].remainQuantity,
                mary:index_zhu.arr[i-today+1].unitCost,
                mary:index_zhu.arr[i-today+1].promotionCost,
              });
            }else if(index_zhu.arr[i-today+1].remainQuantity == 0){
              // index_zhu.arr[i].mary='已售完'
              // console.log("已售完")
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:false,
                number:index_zhu.arr[i-today+1].remainQuantity,
                id:index_zhu.arr[i-today+1].goodsId,
                mary:index_zhu.arr[i-today+1].unitCost,
                no_mary:index_zhu.arr[i-today+1].promotionCost,
              });
            }
            else{
              console.log(index_zhu.arr1,index_zhu.arr[i-today+1].kg,i-today+1,444441111111);
              data.push({
                value:i-week+1,
                type:'next',
                kg:index_zhu.arr[i-today+1].kg,
                number:index_zhu.arr[i-today+1].remainQuantity,
                id:index_zhu.arr[i-today+1].goodsId,
                mary:index_zhu.arr[i-today+1].unitCost,
                no_mary:index_zhu.arr[i-today+1].promotionCost,
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
            console.log(this.data.arr,'本月的arr') 
            if(index_zhu.arr[i+1-today].remainQuantity < index_zhu.number){
              data.push({//今天可选
                value:'今天',
                type:'before',
                kg:false,
                mary:index_zhu.arr[i+1-today].unitCost,
                no_mary:index_zhu.arr[i+1-today].promotionCost
              });
            }else{
              // console.log(this.data.arr,'本月的arr')
              data.push({//今天可选
                value:'今天',
                type:'now',
                kg:true,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost,
                id:index_zhu.arr[i-today+1].goodsId,
                no_mary:index_zhu.arr[i+1-today].promotionCost,
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
              mary:index_zhu.arr[i+1-today].unitCost,
              no_mary:index_zhu.arr[i+1-today].promotionCost,
            });
          }else{
            if(index_zhu.arr[i+1-today].remainQuantity <= this.data.number || index_zhu.arr[i+1-today].remainQuantity == 0){
              data.push({//本月明天可选
                value:'明天',
                type:'before',
                kg:false,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost,
                no_mary:index_zhu.arr[i+1-today].promotionCost,
              });
            }else{
              data.push({//本月明天可选
                value:'明天',
                type:'now',
                kg:index_zhu.arr[i+1-today].kg,
                number:index_zhu.arr[i+1-today].remainQuantity,
                mary:index_zhu.arr[i+1-today].unitCost,
                id:index_zhu.arr[i+1-today].goodsId,
                no_mary:index_zhu.arr[i+1-today].promotionCost,
              }); 
            }
            
          }
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){ 
            // console.log(i+"下月星期天")
            // console.log(this.data.arr1)
            data.push({//下月部分星期天
              value:i-week+1,
              type:'before',
              name:"周天"
            });
          }else{
            console.log(i-week)
            console.log(index_zhu.arr1[i-week],111111111111111)
            if(index_zhu.arr1[i-week].remainQuantity > 1 && index_zhu.arr1[i-week].remainQuantity<index_zhu.number){
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                kg:index_zhu.arr1[i-week].kg,
                number:index_zhu.arr1[i-week].remainQuantity,
                mary:index_zhu.arr1[i-week].unitCost,
                id:index_zhu.arr1[i-week].goodsId,
                no_mary:index_zhu.arr1[i-week].promotionCost
              });
            }else if(index_zhu.arr1[i-week].remainQuantity == 0){
              
              // index_zhu.arr1[i].mary='已售完'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:index_zhu.arr1[i-week].remainQuantity,
                mary:index_zhu.arr1[i-week].unitCost,
                id:index_zhu.arr1[i-week].goodsId,
                no_mary:index_zhu.arr1[i-week].promotionCost
              });
            }else{
              // console.log(index_zhu.arr1[i-week],index_zhu.arr1[i-week].kg,22222222111)
              data.push({
                value:i-week+1,
                type:'next',
                kg:index_zhu.arr1[i-week].kg,
                number:index_zhu.arr1[i-week].remainQuantity,
                mary:index_zhu.arr1[i-week].unitCost,
                id:index_zhu.arr1[i-week].goodsId,
                no_mary:index_zhu.arr1[i-week].promotionCost
              })
            }
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
      // console.log(data,5555)
      if(bool == true){
        this.setData({
          date_data1:data
        })
      }else if(bool == false){
        this.setData({
          date_data2:data
        })
      }
      console.log(data,6666)
    
  },
  dealDate:function(today_month,bool){
    
    var that = this;
   app.getRequest({
     url:app.globalData.KrUrl+"api/gateway/krseat/seat/goods/list",
     methods:"GET",
     data:{
      seatId:1
     },
     success:res=>{
       console.log(res)
      for(let i of res.data.data){
        i.kg = false
      }
       that.setData({
         arr:res.data.data
       },function(){
        let value = wx.getStorageSync('data-index')
        if(!value){
          // console.log("没有本地存储")
          that.test(today_month,bool);
        }else{
          wx.getStorage({key:"data-index",success:res=>{
            console.log(res)
            let arr = that.data.arr
            for(let i of res.data){
              for(let j of arr){
                if(i.id == j.goodsId){
                  j.kg = true
                }
              }
            }
            that.setData({
              number:res.data[0].number_a,
              arr : arr
            })
            console.log(that.data.number)
            setTimeout(function (){
              that.test(today_month,bool);
            },10)
          }})
          
         
        }
          
       })
     }
   })
    
    
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
    this.setData({
      id:e.id
    })
    
    const today_date = new Date();
    
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    
    const date1 = this.dealDate(today_month,true);
    // console.log(date1);
    const date2 = this.dealDate(next_month,false);
    this.setData({
      
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
    
    // console.log(this.data.date_data2)
  }
  
})
