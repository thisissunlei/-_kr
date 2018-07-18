//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inn:[],
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
    
  },
  all_day_num:0,
  last_btn_num:'false',
  last_data:'false',
  arr:[
    {number:0,mary:20,kg:false},{number:0,mary:3450,kg:false},{number:2,mary:234,kg:false},{number:34,mary:345,kg:false},{number:12,mary:0,kg:false},
    {number:20,mary:30,kg:false},{number:0,mary:878,kg:false},{number:6,mary:450,kg:false},{number:9,mary:354,kg:false},{number:25,mary:340,kg:false},
    {number:234,mary:35670,kg:false},{number:45,mary:34,kg:false},{number:12,mary:42,kg:false},{number:29,mary:36,kg:false},{number:26,mary:36,kg:false},
    {number:224,mary:578,kg:false},{number:13,mary:54,kg:false},{number:5,mary:67,kg:false},{number:1,mary:356,kg:false},{number:26,mary:343,kg:false},
    {number:0,mary:89,kg:false},{number:5,mary:232,kg:false},{number:12,mary:378,kg:false},{number:0,mary:3460,kg:false},{number:20,mary:33,kg:false},
    {number:33,mary:456,kg:false},{number:12,mary:345,kg:false},{number:22,mary:389,kg:false},{number:23,mary:340,kg:false},{number:24,mary:32,kg:false},
    {number:12,mary:76,kg:false},
  ],
  arr1:[
    {number:0,mary:20,kg:false},{number:0,mary:3450,kg:false},{number:2,mary:234,kg:false},{number:34,mary:345,kg:false},{number:12,mary:0,kg:false},
    {number:20,mary:30,kg:false},{number:0,mary:878,kg:false},{number:6,mary:450,kg:false},{number:9,mary:354,kg:false},{number:25,mary:340,kg:false},
    {number:234,mary:35670,kg:false},{number:45,mary:34,kg:false},{number:12,mary:42,kg:false},{number:29,mary:36,kg:false},{number:26,mary:36,kg:false},
    {number:224,mary:578,kg:false},{number:13,mary:54,kg:false},{number:5,mary:67,kg:false},{number:1,mary:356,kg:false},{number:26,mary:343,kg:false},
    {number:0,mary:89,kg:false},{number:5,mary:232,kg:false},{number:12,mary:378,kg:false},{number:0,mary:3460,kg:false},{number:20,mary:33,kg:false},
    {number:33,mary:456,kg:false},{number:12,mary:345,kg:false},{number:22,mary:389,kg:false},{number:23,mary:340,kg:false},{number:24,mary:32,kg:false},
    {number:12,mary:76,kg:false},
  ],
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  diantrue(){
    console.log(1)
    
  },
  // jian(){
  //   if(this.data.number>1){
  //     this.setData({
  //       number:this.data.number-=1
  //     })
  //   }
    
  // },
  jia(){
    this.arr.map((item,index)=>{
      if(item.kg == true){
        console.log(item)
      }
    })
    this.setData({
      number:this.data.number+=1
    })
    
  },
  dateBtn :function(e){
    
    this.setData({
      index1:e.target.dataset.num
    })
    this.arr[e.target.dataset.num].kg=!this.arr[e.target.dataset.num].kg
 
    const today_date = new Date();
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)//当月开始时间
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)//下月开始时间
   
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

    
    // this.dealDate()
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      console.log(e);
      const new_data = this.data[e.target.dataset.data];//遍历的哪条数组
      var old_data = [];
      if(this.last_data!='false'){//默认为false
        if(this.last_data=='date_data1'){
          old_data = this.data['date_data1'];
          // old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
          this.setData({
            date_data1:old_data
          });
        }else if(this.last_data=='date_data2'){
          old_data = this.data['date_data2'];
          // old_data[this.last_btn_num]['type'] = old_data[this.last_btn_num]['type'].replace('active ','');
          this.setData({            
            date_data2:old_data
          });
        }
      }     
      // new_data[parseInt(e.target.dataset.num)]['type'] = 'active ' + new_data[parseInt(e.target.dataset.num)]['type'];
      if(e.target.dataset.data=='date_data2'){
        this.setData({
          date_data2:new_data,         
        });
      }else if(e.target.dataset.data=='date_data1'){
        this.setData({
          date_data1:new_data,        
        });
      }
      this.last_btn_num = e.target.dataset.num;
      this.last_data = e.target.dataset.data;  
      console.log(e.target.dataset)
    }
  },
  dealDate:function(today_month,bool){
    const week = today_month.getDay();//月第一天星期几
    const today = parseInt(new Date().getDate());//今天是几号
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;//31天+ 星期三==34
    const data = [];
    console.log()
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
                number:this.arr[i].number,
                mary:this.arr[i].mary
              })
            
          }else{
            if(this.arr[i].number > 1 && this.data.number>this.arr[i].number){
              this.arr[i].mary='数量不足'
              console.log(this.arr[i])
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:this.arr[i].number,
                mary:this.arr[i].mary,
                name:i
              });
            }else if(this.arr[i].number == 0){
              this.arr[i].mary='已售完'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:this.arr[i].number,
                mary:this.arr[i].mary,
                name:i
              });
            }
            else{
              data.push({
                value:i-week+1,
                type:'next',
                kg:this.arr[i].kg,
                number:this.arr[i].number,
                mary:this.arr[i].mary
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
            data.push({//今天可选
              value:'今天',
              type:'now',
              kg:this.arr[i].kg,
              number:this.arr[i].number,
              mary:this.arr[i].mary
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              type:'before',
              
            });
          }else{
            data.push({//本月明天可选
              value:'明天',
              type:'now',
              kg:this.arr[i].kg,
              number:this.arr[i].number,
              mary:this.arr[i].mary
            });
          }
          
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){ 
            data.push({//下月部分不可选可能买完，或不足
              value:i-week+1,
              type:'before',
              number:this.arr[i].number,
              mary:this.arr[i].mary,
              name:"周天"
            });
          }else{
            
            if(this.arr1[i].number > 1 && this.arr1[i].number<this.data.number){
              console.log('数量不足')
              console.log(i)
              this.arr1[i].mary='数量不足'
              console.log(this.arr1[i])
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:this.arr1[i].number,
                mary:this.arr1[i].mary,
               
              });
            }else if(this.arr1[i].number == 0){
              console.log('已售完')
              console.log(i)
              this.arr1[i].mary='已售完'
              data.push({//除周六日可选
                value:i-week+1,
                type:'before',
                number:this.arr1[i].number,
                mary:this.arr1[i].mary,
                name:i
              });
            }else{
              console.log('剩下的')
              console.log(i)
              data.push({
                value:i-week+1,
                type:'next',
                kg:this.arr1[i].kg,
                number:this.arr1[i].number,
                mary:this.arr1[i].mary
              })
            }
          }
  
          break;
        default:
          data.push({//已经过去的时间灰色不可选
            value:i-week+1,
            type:'before'
          });
          //this.all_day_num++;
        }
      }
    return data;
    
  },


  onLoad: function () {
    
    
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
  }
  
})
