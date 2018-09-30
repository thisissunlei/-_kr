
var Tween = {
	Quad: {
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}
	}
}
var b=0,c=0,d=500,t=0;
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
		allRun()
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
let one = 0;
let tow = 1200;
// 判断当前显示的是哪个list	
let boxIndex = 2;

let moveNum = 0;
var allRun = function(){
	// var top = Math.ceil(Tween.Quad.easeOut(t,b,c,d))
	moveNum  += 10;
	var top = moveNum
	let len = numData.length;
	for (var i = 0; i < len; i++) {
		let oneTop = one-top;
		numData[i].oneTop =oneTop;
		let towTop = tow-top
		numData[i].towTop = towTop
	}
	console.log('numData--1',numData)
	that.setData({
		numArr : numData
	},function(){
		// checkList()
		if(moveNum>1200){
			let index =	Math.ceil(moveNum/1200);
			let num = index%2 == 1?'one':'tow';//当前所在
			console.log('当前所在高度',moveNum,'index',index,'当前所在list',num,'top',one,tow)
			if(num === 'one'){
				tow = (index-1) *1200
			}else{
				one = index * 1200
			}
			console.log('numData',numData)
		}
		if(moveNum<=1250){
			requestAnimationFrame(allRun); 
		}
	})
}
// 判断当前的top显示的是哪个list
var checkList = function(){
	let index =	Math.ceil(moveNum/1200);
	let num = index%2 == 1?'one':'tow';
	console.log('checkList',index,num)
	
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