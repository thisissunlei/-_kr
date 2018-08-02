
var CAlculagraph = function() {

  return new CAlculagraph.fn.init();
}


CAlculagraph.fn = CAlculagraph.prototype = {

  timerMint : timerMint,
  init : function (){
    return CAlculagraph.fn;
  }

}
    
/*
  {
    deadline:101245152,//最终结束的时间戳,
    callback:function (){},//时间结束后的方法,
    minute:secdom,//秒的dom节点,
    second:mintdom,//分钟的dom节点,
  }
*/
function timerMint(agmt_time){  
  var t,day,hour,minute,second,bools,dates=new Date(),nowtime=Math.round(agmt_time.deadline-dates.getTime()/1000);
  init();
  function init(){
    if(nowtime<1){
      nowtime=0;
    }
    day=Math.floor(nowtime/86400);
    hour=Math.floor((nowtime%86400)/3600);
    minute=Math.floor(((nowtime%86400)%3600)/60);
    second=Math.floor(((nowtime%86400)%3600)%60);
    bools=[false,false,false,false]; 
    if(second<10){
      
      agmt_time.that.setData({
        second : '0'+second
      });
    }else{
      agmt_time.that.setData({
       second:second
      });
    }
    if(minute<10){
      agmt_time.that.setData({
        minute : '0'+minute
      });
    }else{
      agmt_time.that.setData({
        minute:minute
      });
    }
    
    t=setTimeout(secondRun,1000);
  }
  function secondRun(){
      if(second>0){
        if(nowtime-(agmt_time.deadline-Math.round(new Date().getTime()/1000))<3){
          second--;
          nowtime--;
          if(second<10){
            agmt_time.that.setData({
              second : '0'+second
            });
          }else{
            agmt_time.that.setData({
              second:second
            });
          }
          t=setTimeout(secondRun,1000);
        }else{
          nowtime=agmt_time.deadline-Math.round(new Date().getTime()/1000);
          init();
        }
      }else{
        bools[0]=true;
        minuteRun();
      }
  }
  function minuteRun(){
    if(minute>0){
        minute--;
        if(minute<10){
          

          agmt_time.that.setData({
            minute : '0'+minute
          });
        }else{
          agmt_time.that.setData({
            minute:minute
          });
        }
        bools[0]=false;
        second=60;
        secondRun();
      }else{
      bools[1]=true;
      doThing();
    }
  }

  function doThing(){
    if(bools[0]&&bools[1]){
      if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
        agmt_time.callback();
      }
    }
  }
}

module.exports = {
  CAlculagraph: CAlculagraph
}














