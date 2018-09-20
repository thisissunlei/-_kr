/*
  参数传入：{
    btn_bool:是否单选，true/false,
    data:{},价格详情
    init_data:{
      last_btn_num:'',
      last_data:'',
    }初始化数据

  }
  
*/

export class dateData{
  constructor(parameter){
    this.date_data1=[];
    this.date_data2=[];
    // 不带价钱的日历数据
    this.data_list = parameter.data ;

    const last_date_obj = this.dateChange(parameter.init_data.last_btn_num)
    this.last_btn_num = last_date_obj.num;
    this.last_btn_date = last_date_obj.day_num
    this.last_data = parameter.init_data.last_data;
    this.btn_bool = parameter.btn_bool;
    this.initData();
  }
  all_day_num = 0;
  get_value = [];
  dateChange(date_time){
    const today_date = new Date(date_time);
    const day_num = today_date.getDate(); 
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1);
    let week = today_month.getDay();
    return {
      day_num : day_num, //具体日期号码
      num : day_num+week-1, //在date_data1和date_data2数组中位置
    };
  }
  dealDate(today_month,bool){
    let t_times = today_month.getTime();
    //start --计算每个月多少个格子，包括一号前的空白格子。
    const week = today_month.getDay();//当前周几
    const today = parseInt(new Date().getDate());
    today_month.setMonth(today_month.getMonth() + 1);
    today_month.setDate(0);
    const day_num = today_month.getDate()+week;
    //--end
    const data = [];
    for (var i = 0; i < day_num; i++) {
      switch (true){
        case i<week:
          data.push({
            value:'',
            type:'before',
            num:i
          });
          break;
        case i>(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }else{
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'next',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week-1)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'今天',
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }else{
            data.push({
              value:'今天',
              day_num:i-week+1,
              type:'now',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }
          this.all_day_num++;
          break;
        case i==(today+week)&&bool:
          if(i%7==0||i%7==6){
            data.push({
              value:'明天',
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }else{
            data.push({
              value:'明天',
              day_num:i-week+1,
              type:'now',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }
          
          this.all_day_num++;
          break;
        //i取值必须从下个月1号的单元格开始，所以需要+week
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }else{
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'next',
              date_times:t_times+24*3600*1000*(i-week),
              num:i
            });
          }
  
          break;
        default:
          data.push({
            value:i-week+1,
            day_num:i-week+1,
            type:'before',
            date_times:t_times+24*3600*1000*(i-week),
            num:i
          });
        }
      }
    return data;
    
  }
  //bool、this.btn_bool:true为会议室，单选
  dateBtn(e,bool){
    if(e.target.dataset.alldata&&(e.target.dataset.alldata.type.indexOf('next')>-1||e.target.dataset.alldata.type.indexOf('now')>-1)){
      const new_data = this[e.target.dataset.data];
      if(!this[this.last_data]&&this.btn_bool){
        this[this.last_data][this.last_btn_num]['type'] = this[this.last_data][this.last_btn_num]['type'].replace('active ','');
      }

      //双击取消
      let e_type = new_data[parseInt(e.target.dataset.alldata.num)]['type'];
      if(e_type.indexOf('active')>-1&&!this.btn_bool){
        new_data[parseInt(e.target.dataset.alldata.num)]['type'] =  e_type.replace('active ','');
        for(let i = 0;i<this.get_value.length;i++){
          if(e.target.dataset.alldata.num == this.get_value[i].alldata.num){
            this.get_value.splice(i,1);
          }
        }
      }else{
        new_data[parseInt(e.target.dataset.alldata.num)]['type'] = 'active ' + e_type;
        this.last_btn_num = e.target.dataset.alldata.num;
        this.last_data = e.target.dataset.data;  
        if(this.btn_bool){
          this.get_value = [e.target.dataset];
        }else{
          this.get_value.push(e.target.dataset);
        }
        return e.target
      }
      

    }
  }
  initData(){
    const today_date = new Date();
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    this.date_data1 = this.dealDate(today_month,true);
    this.date_data2 = this.dealDate(next_month,false);
    // this.btn_bool:true为会议室，单选
    // 如果是单选，则为会议室日历，单独处理数据
    if(this.btn_bool){
      this.checkDate(this.date_data1)
      this.checkDate(this.date_data2)
    }
    this[this.last_data][this.last_btn_num]['type'] = 'active ' + this[this.last_data][this.last_btn_num]['type']; 
    this.get_value = [{
      alldata:this[this.last_data][this.last_btn_num],
      data:this.last_data
    }];
  }
  checkDate(data){
    let dateList = [];
    dateList = this.data_list.map(item=>{
      return item.date
    })
    let _this = this;
    data.map(item=>{
      if(item.date_times){
        let day = _this.formatTime(item.date_times)
        if(dateList.indexOf(day) == -1){
            item.type = 'before'
        }
      }
    })
  }
  formatTime(times){
    let date = new Date(times);
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month>9?month:'0'+month;
    day = day>9?day:'0'+day;
    return year+'-'+month+'-'+day;
  }
  getValue(){
    return this.get_value;
  }
  setValue(value){
    this.get_value = value;
  }
}
export class dateDataPrice extends dateData{

  constructor (parameter){
    super(parameter);
    this.curMonth = parameter.data.curMonth || [];
    this.nextMonth = parameter.data.nextMonth || [];
    this.dealDataPrice(this.curMonth,this.date_data1);
    this.dealDataPrice(this.nextMonth,this.date_data2);
    
    
  }
  max_num = 1;
  final_num = 1;
  init_bool = [false,false];//当天19点之后，选中当天进到日历页面，删除当天的默认选中状态的值。
  init_bool_num = 0;
  dealDataPrice(month_arr,store_data){
    let data_num = 0;
      for(let i = 0;i<store_data.length;i++){
        if(month_arr&&month_arr.length>0&&month_arr[data_num]){
          const data_day = new Date(month_arr[data_num].useTime).getDate();
          if(store_data[i].day_num == data_day){
              if(this.last_btn_date == data_day){
                // 当天19点之后，选中当天进到日历页面，删除当天的默认选中状态的值
                this.init_bool[this.init_bool_num] = true;
              }
              if(store_data[i].type&&store_data[i].type!='before'){
                  
                  store_data[i].seat = month_arr[data_num];
                  const arr_num = month_arr[data_num]['remainQuantity'];
                  if(arr_num<1){
                    //已售罄
                    if(this.last_btn_date == data_day){
                      this.init_bool[this.init_bool_num] = false;
                    }
                    store_data[i].type = 'before';
                    store_data[i].price_vlue = '已售罄'
                  }else{
                    store_data[i].price_vlue = month_arr[data_num]['promotionCost'];
                  }
                  if(this.max_num<arr_num){
                    this.max_num = arr_num;//控制所有日期散座最大数量的值
                  }
              }
              data_num++;
          }else{
            
            
            //返回数据没有数量的，不可点击
            store_data[i].type = 'before';
          }
        }else{
          //下个月没有价格数据，全部不可点
            store_data[i].type = 'before';
        }
        
      }
      this.init_bool_num ++;
    if(!this.init_bool[0]&&!this.init_bool[1]&&this.init_bool_num===2){
      this.setValue([]);
      this.init_bool_num = 0;
    }
    
  }
  addNum(){
    if(this.final_num<this.max_num){
      this.final_num++;
      for(let i=0;i<this.date_data1.length;i++){
        if(this.date_data1[i].type!='before'){
          if(this.date_data1[i]['seat']){
            if(this.date_data1[i]['seat']['remainQuantity']<this.final_num){
              this.date_data1[i]['type'] = 'before';
              this.date_data1[i]['price_vlue'] = '数量不足';
            }
          }
        }
      }
      for(let j=0;j<this.date_data2.length;j++){
        if(this.date_data2[j].type!='before'){
          if(this.date_data2[j]['seat']){
            if(this.date_data2[j]['seat']['remainQuantity']<this.final_num){
              this.date_data2[j]['type'] = 'before';
              this.date_data2[j]['price_vlue'] = '数量不足';
            }
          }
        }
      }
      for (let k = 0; k < this.get_value.length; k++) {
        let v_type = this.get_value[k]['alldata']['num'];
        let v_data = this.get_value[k]['data'];
        if(this[v_data][v_type]['type'].indexOf('before')>-1){
          this.get_value.splice(k,1);
          k--;
        }
      }
    }
    if(this.final_num>=this.max_num){
      return {
        final_num:this.final_num,
        final_bool:false,
        final_r_bool:true
      };
    }else if(this.final_num<=1){
      return {
        final_num:this.final_num,
        final_bool:true,
        final_r_bool:false
      };
    }else{
      return {
        final_num:this.final_num,
        final_bool:true,
        final_r_bool:true
      };
    }
  }
  reduceNum(){
    if(this.final_num>1){
      this.final_num--;
      for(let i=0;i<this.date_data1.length;i++){
        if(this.date_data1[i].value!=''){
          if(this.date_data1[i]['seat']){
            if(this.date_data1[i]['seat']['remainQuantity']>=this.final_num){
              if(this.date_data1[i]['price_vlue']=='数量不足'){
                this.date_data1[i]['type'] = (this.date_data1[i]['value']=='今天'||this.date_data1[i]['value']=='明天') ? 'now' : 'next';
                this.date_data1[i]['price_vlue'] = this.date_data1[i]['seat']['promotionCost'];
              }
            }
          }
        }
      }
      for(let j=0;j<this.date_data2.length;j++){
        if(this.date_data2[j].value!=''){         
          if(this.date_data2[j]['seat']){
            if(this.date_data2[j]['seat']['remainQuantity']>=this.final_num){
              if(this.date_data2[j]['price_vlue']=='数量不足'){
                this.date_data2[j]['type'] = (this.date_data2[j]['value']=='今天'||this.date_data2[j]['value']=='明天') ? 'now' : 'next';;
                this.date_data2[j]['price_vlue'] = this.date_data2[j]['seat']['promotionCost'];
              }
            }
          }
        }
      }
    }
    if(this.final_num>=this.max_num){
      return {
        final_num:this.final_num,
        final_bool:false,
        final_r_bool:true
      };
    }else if(this.final_num<=1){
      return {
        final_num:this.final_num,
        final_bool:true,
        final_r_bool:false
      };
    }else{
      return {
        final_num:this.final_num,
        final_bool:true,
        final_r_bool:true
      };
    }

  }
  getFinalNum(){
    return this.final_num
  }
}