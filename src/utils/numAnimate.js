
var Tween = {
	Quad: {
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}
	}
}
var b=0,c=0,d=500,t=0;
var imgHeight = 120;//单独数字的高度
var ListHeight = 1200;//循环动画的高度
var numData = []
var obj = {}
var that ;
var index = 0
// 活动方法
var animate = function(numArr,number,_this){
	that = _this;
	let len = number.length;
	numData = dealData(numArr,number)
	c = numData[index].label*imgHeight;
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
			c = numData[index].label*imgHeight;
			obj = numData[index];
			Run()
		}
	})
	
	
}


// 分享后方法

var animates = function(numArr,_this,callback){
	that = _this;
	numData = dealList(numArr)
	that.setData({
		numArr : numData
	},function(){
		c = 120*19
		allRun(callback)
	})
	
}
var dealList = function(numArr){
	let len = numArr.length;
	for (var i = 0; i < len; i++) {
		numArr[i].oneTop = 0;
		numArr[i].top = 0;
		numArr[i].towTop = ListHeight;
		numArr[i].targetTop = false;
		numArr[i].targetBox = ''
	}
	return numArr;
}
let one = 0;
let tow = ListHeight;
let moveNum = 0;
// 是否转动
let move = true
let moved = [];
var allRun = function(callback){
	moveNum  += 10;
	var top = moveNum
	let len = numData.length;
	let index =	Math.ceil(moveNum/ListHeight);
	let num = index%2 == 1?'one':'tow';//当前所在
	for (var i = 0; i < len; i++) {
		if(num === numData[i].targetBox && num === 'one' && moveNum >= numData[i].targetMove){
			numData[i].oneTop = '-'+numData[i].targetTop;
			moved[i] = true
		}else{
			let oneTop = one-top;
			numData[i].oneTop =oneTop
		}

		if(num === numData[i].targetBox && num === 'tow' && moveNum >= numData[i].targetMove){
			numData[i].towTop = '-'+numData[i].targetTop;
			moved[i] = true
		}else{
			let towTop = tow-top
			numData[i].towTop = towTop
		}
		if(i === 2){
		}
		
	}
	that.setData({
		numArr : numData
	},function(){
		if(moveNum>ListHeight){
			if(num === 'one'){
				tow = index *ListHeight
			}else{
				one = index * ListHeight
			}
		}
		if(move){
			window.requestAnimFrame = (function () {
	            return window.requestAnimationFrame ||
	                window.webkitRequestAnimationFrame ||
	                window.mozRequestAnimationFrame ||
	                function (callback) {
	                    window.setTimeout(callback, 6000 / 60);
	                };
	        })();



			requestAnimFrame(()=>{allRun(callback)});
			if(moved.length == numData.length){
				move = false
			} 
		}else{
			callback(that)
		}
	})
}
var stoped = true
var stop = function(num){
	console.log('==========')
	if(!stoped){
		return
	}
	stoped = false;
	console.log('---------')
	let index =	Math.ceil(moveNum/ListHeight);
	let box = index%2 == 1?'tow':'one';//当前所在
	let len = num.length;
	for (var i = 0; i < len; i++) {
		let number = parseInt(num.slice(i,i+1));
		numData[i].targetMove = index*ListHeight+number*imgHeight;
		numData[i].targetTop = number*imgHeight;
		numData[i].targetBox = box;
	}
}
module.exports = {
	animate:animate,
	animates:animates,
	stop:stop
}