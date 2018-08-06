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
    this.last_btn_num = parameter.init_data.last_btn_num;
    this.last_data = parameter.init_data.last_data;
    this.btn_bool = parameter.btn_bool;
    this.initData();
  }
  all_day_num = 0;
  get_value = [];
  dealDate(today_month,bool){
    
    let t_times = today_month.getTime();
    //console.log(new Date(t_times+24*3600*1000),today_month,77777)
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
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week)
            });
          }else{
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'next',
              date_times:t_times+24*3600*1000*(i-week)
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
              date_times:t_times+24*3600*1000*(i-week)
            });
          }else{
            data.push({
              value:'今天',
              day_num:i-week+1,
              type:'now',
              date_times:t_times+24*3600*1000*(i-week)
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
              date_times:t_times+24*3600*1000*(i-week)
            });
          }else{
            data.push({
              value:'明天',
              day_num:i-week+1,
              type:'now',
              date_times:t_times+24*3600*1000*(i-week)
            });
          }
          
          this.all_day_num++;
          break;
        case i<(30-this.all_day_num+week)&&!bool:
          if(i%7==0||i%7==6){
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'before',
              date_times:t_times+24*3600*1000*(i-week)
            });
          }else{
            data.push({
              value:i-week+1,
              day_num:i-week+1,
              type:'next',
              date_times:t_times+24*3600*1000*(i-week)
            });
          }
  
          break;
        default:
          data.push({
            value:i-week+1,
            day_num:i-week+1,
            type:'before',
            date_times:t_times+24*3600*1000*(i-week)
          });
        }
      }
    return data;
    
  }
  dateBtn(e,bool){
    if(e.target.dataset.bool=='next'||e.target.dataset.bool=='now'){
      const new_data = this[e.target.dataset.data];
      if(this[this.last_data]!='false'&&this.btn_bool){
        this[this.last_data][this.last_btn_num]['type'] = this[this.last_data][this.last_btn_num]['type'].replace('active ','');
      }     
      new_data[parseInt(e.target.dataset.num)]['type'] = 'active ' + new_data[parseInt(e.target.dataset.num)]['type'];
       this.last_btn_num = e.target.dataset.num;
       this.last_data = e.target.dataset.data;  
      if(this.btn_bool){
        this.get_value = [e.target.dataset];
      }else{
        this.get_value.push(e.target.dataset);
      }
      console.log(this.getValue())
      return e.target

    }
  }
  initData(){
    const today_date = new Date();
    const today_month = new Date(today_date.getFullYear(),today_date.getMonth(),1)
    const next_month = new Date(today_date.getFullYear(),today_date.getMonth()+1,1)
    this.date_data1 = this.dealDate(today_month,true);
    this.date_data2 = this.dealDate(next_month,false);
    this[this.last_data][this.last_btn_num]['type'] = 'active ' + this[this.last_data][this.last_btn_num]['type']; 
    this.get_value = [this[this.last_data][this.last_btn_num]];
    console.log(this.get_value,9999)
  }
  getValue(){
    return this.get_value;
  }
}
export class dateDataPrice extends dateData{

  constructor (parameter){
    super(parameter);
    //console.log(this,1111,data)
    this.curMonth = parameter.data.curMonth;
    this.nextMonth = parameter.data.nextMonth;
    ////console.log(this.curMonth)
    this.dealDataPrice(this.curMonth,this.date_data1);
    this.dealDataPrice(this.nextMonth,this.date_data2);
    console.log(this.getValue())
  }
  max_num = 1;
  final_num = 1;
  
  dealDataPrice(month_arr,store_data){
    let data_num = 0;
    if(month_arr&&month_arr.length>0){
      for(let i = 0;i<store_data.length;i++){
        //console.log(month_arr[data_num])
        if(month_arr[data_num]){
          const data_day = new Date(month_arr[data_num].useTime).getDate();
          //console.log(data_day,store_data[i].day_num,new Date(store_data[i].date_times).getDate(),store_data[i],1111)
   
          if(store_data[i].day_num == data_day){
            if(store_data[i].type&&store_data[i].type!='before'){
              store_data[i].seat = month_arr[data_num];

              const arr_num = month_arr[data_num]['remainQuantity'];
              if(arr_num<1){
                store_data[i].type = 'before';
                store_data[i].price_vlue = '已售罄'
              }else{
                store_data[i].price_vlue = month_arr[data_num]['promotionCost'];
              }
              if(this.max_num<arr_num){
                this.max_num = arr_num;
              }
            }
            
            data_num++;
          }
        }
        
      }
    }
  }
  addNum(){
    if(this.final_num<=this.max_num){
      this.final_num++;
      for(let i=0;i<this.date_data1.length;i++){
        if(this.date_data1[i].type!='before'){
          //console.log(this.date_data1[i])
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
            console.log(888,this.date_data2[j]['seat']['remainQuantity'],this.final_num)
            if(this.date_data2[j]['seat']['remainQuantity']<this.final_num){
              
              this.date_data2[j]['type'] = 'before';
              this.date_data2[j]['price_vlue'] = '数量不足';
              console.log(999,this.date_data2[j]['type'],this.date_data2[j])
            }
          }
        }
      }
      
    }
    if(this.final_num>this.max_num){

      return false;
      console.log(111122333)
    }else{
      return true;
    }
  }
  reduceNum(){
    if(this.final_num>1){
      this.final_num--;
      for(let i=0;i<this.date_data1.length;i++){
        if(this.date_data1[i].value!=''){
          //console.log(this.date_data1[i])
          if(this.date_data1[i]['seat']){
            if(this.date_data1[i]['seat']['remainQuantity']>this.final_num){
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
            if(this.date_data2[j]['seat']['remainQuantity']<this.final_num){
              if(this.date_data1[i]['price_vlue']=='数量不足'){
                this.date_data2[j]['type'] = (this.date_data2[j]['value']=='今天'||this.date_data2[j]['value']=='明天') ? 'now' : 'next';;
                this.date_data2[j]['price_vlue'] = this.date_data2[j]['seat']['promotionCost'];
              }
            }
          }
        }
      }
      
    }
    if(this.final_num>this.max_num){

      return false;
      console.log(111122333)
    }else{
      return true;
    }
  }

}