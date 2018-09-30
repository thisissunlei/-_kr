
var Tween = {
	Quad: {
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}
	}
}
var b=0,c=0,d=1000,t=0;
var numData = []
var obj = {}
var that ;
var index = 0
// 活动方法
var animate = function(numArr,number,_this){
	that = _this;
	let len = number.length;
	numData = dealData(numArr,number)
	c = numData[index].label*120;
	obj = numData[index];
	Run()

}

var dealData = function(numArr,number){
	let len = number.length;
	for (var i = 0; i < len; i++) {
		numArr[i].label = number.slice(i,i+1);
		numArr[i].top = 0;
	}
	return numArr;
}

var Run = function(){
	obj.top = Math.ceil(Tween.Quad.easeOut(t,b,c,d));
	that.setData({
		numArr : numData
	},function(){
		if(t<d){ 
			t++; 
			setTimeout(Run, 1); 
		}else if(t == d && index < numData.length-1){
			index++;
			t=0;
			c = numData[index].label*120;
			obj = numData[index];
			Run()
		}
	})
	
	
}
// 分享后方法
var animates = function(numArr,_this){
	that = _this;
	numData = dealList(numArr)
	that.setData({
		numArr : numData
	},function(){
		c = 120*19;
		// allRun()
	})
	
}
var dealList = function(numArr){
	let len = numArr.length;
	for (var i = 0; i < len; i++) {
		numArr[i].oneTop = 0;
		numArr[i].top = 0;
		numArr[i].towTop = 1200;
	}
	return numArr;
}
var allRun = function(){
	var top = Math.ceil(Tween.Quad.easeOut(t,b,c,d))
	let len = numData.length;
	for (var i = 0; i < len; i++) {
		// numData[i].top = top;
		numData[i].oneTop = '-'+top;
		let towTop = top +1200
		numData[i].towTop = '-'+towTop
	}
	that.setData({
		numArr : numData
	},function(){
		if(t<d){ 
			t++; 
			setTimeout(allRun, 1); 
		}
	})
}
// export class animate{
//   constructor(parameter){
//   	console.log('animate-parameter',parameter)
//   	this.numArr = parameter.number;
//   }


//  }
module.exports = {
	animate:animate,
	animates:animates
}