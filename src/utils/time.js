export class CAlculagraph{
  constructor(parameter){
    this.agmt_time = parameter;
    this.nowtime=Math.round(this.agmt_time.deadline - new Date().getTime()/1000);
    this.clearT();
    this.timerInt();
  }
  c_minute = '';
  c_second = '';
  nowtime = '';
  c_time = '';
  cal_bool = true;
  bools=[false,false]; 
  timerInt(){
    let agmt_time = this.agmt_time;
    if(this.nowtime<1){
      this.nowtime=0;
    }
    // day=Math.floor(this.nowtime/86400);
    // hour=Math.floor((this.nowtime%86400)/3600);
    this.c_minute=Math.floor(((this.nowtime%86400)%3600)/60);
    this.c_second=Math.floor(((this.nowtime%86400)%3600)%60);
    
    if(this.c_second<10){
      
      agmt_time.that.setData({
        second : '0'+this.c_second
      });
    }else{
      agmt_time.that.setData({
       second:this.c_second
      });
    }
    if(this.c_minute<10){
      agmt_time.that.setData({
        minute : '0'+this.c_minute
      });
    }else{
      agmt_time.that.setData({
        minute:this.c_minute
      });
    }
    this.c_time=setTimeout(()=>{this.secondRun()},1000);
  }
  secondRun(){
    if(this.cal_bool){

      let agmt_time = this.agmt_time;
      if(this.c_second>0){
        
        if(this.nowtime-(agmt_time.deadline-Math.round(new Date().getTime()/1000))<3){
          this.c_second--;
          this.nowtime--;
          if(this.c_second<10){
            agmt_time.that.setData({
              second : '0'+this.c_second
            });
          }else{
            agmt_time.that.setData({
              second:this.c_second
            });
          }
          this.c_time=setTimeout(()=>{this.secondRun()},1000);
        }else{
          this.nowtime=agmt_time.deadline-Math.round(new Date().getTime()/1000);
          this.timerInt();
        }
      }else{
        this.bools[0]=true;
        this.minuteRun();
      }
    }
  }
  minuteRun(){
    let agmt_time = this.agmt_time;
    if(this.c_minute>0){
        this.c_minute--;
        if(this.c_minute<10){
          

          agmt_time.that.setData({
            minute : '0'+this.c_minute
          });
        }else{
          agmt_time.that.setData({
            minute : this.c_minute
          });
        }
        this.bools[0]=false;
        this.c_second=60;
        this.secondRun();
      }else{
      this.bools[1]=true;
      this.doThing();
    }
  }

  doThing(){
    if(this.bools[0]&&this.bools[1]){
      if(this.agmt_time.callback!=''&&this.agmt_time.callback!=undefined){
        this.agmt_time.callback();
      }
    }
  }
  closeCal(){
    this.cal_bool = false;
  }
  startCal(){
    this.cal_bool = true;
    this.c_time=setTimeout(()=>{this.secondRun()},1000);
  }
  clearT(){
    clearTimeout(this.c_time)
  }
}















