/*
  参数传入：{
  	numArr：一个对应的数组；改变的是这个数组
  	number:传入的数字

  }
  
*/
/*
Tween动画算法
t: current time（当前时间）；
b: beginning value（初始值）；
c: change in value（变化量）；
d: duration（持续时间）。
*/
var Tween = {
	Quad: {
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		Linear: function(t,b,c,d){ return c*t/d + b; },

	}
}
var lastFrameTime = 0;
// 模拟 requestAnimationFrame
var doAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
    var id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
    lastFrameTime = currTime + timeToCall;

    return id;
};
// 模拟 cancelAnimationFrame
var abortAnimationFrame = function (id) {
    clearTimeout(id)
}
var b=0,c=0,d=10,t=0;
var time = 15;
var imgHeight = 100;//单独数字的高度
var ListHeight = 1000;//循环动画的高度
var index = 0
var _this ;
var _that ;
export class demoAnimate {
	constructor(parameter) {
		this.number = parameter.number;
		this.numArr = parameter.numArr;
		_this = parameter._this;
		_that = this;
		t = 0;
		index = 0
		if(parseInt(this.number) == 0){
			return
		}

		let len = this.number.length;
		this.numData = this.dealData()
		if(this.numData[index].label == '0'){
			c = 10 * imgHeight;
			d = 10 * time;

		}else{
			c = this.numData[index].label * imgHeight;
			d = this.numData[index].label * time;
		}
		
		this.obj = this.numData[index];
		this.Run()
	}
	dealData() {
		let len = this.number.length;
		let showAnimate = true;
		if(parseInt(this.number) == 0){
		}
		console.log('dealData',parseInt(this.number))
		let numArr = this.numArr;
		for (var i = 0; i < len; i++) {
			numArr[i].label = this.number.slice(i, i + 1);
			numArr[i].top = 0;
		}
		return numArr;
	}
	Run() {
		_that.obj.top = Math.ceil(Tween.Quad.Linear(t, b, c, d));
		let numData = _that.numData
		_this.setData({
			numArr: numData
		}, function() {
			if (t < d) {
				t++;
				setTimeout(_that.Run, 1);
			} else if (t == d && index < numData.length - 1) {
				index++;
				t = 0;
				if(_that.numData[index].label == '0'){
					d = 10 * time;
					c = 10 * imgHeight;
				}else{
					d = _that.numData[index].label * time;
					c = numData[index].label * imgHeight;
				}
				
				_that.obj = numData[index];
				_that.Run()
			}
		})
	}

}


/*
  点击停止的动画
  参数传入：{
  	numArr：一个对应的数组；改变的是这个数组
  	_this:this指针,
  	callback:执行stop函数后的回调

  }
  
*/

let one = 0;
let tow = ListHeight;
let moveNum = 0;
// 是否转动
let move = true
let moved = [];
var stoped = true
// var requestAnimationFrame = function(a){return setTimeout(a,1000/60)}
export class demoAnimates {
	constructor(parameter) {
		this.numArr = parameter.numArr;
		this.callback = parameter.callback;
		_this = parameter._this;
		_that = this;
		this.numData = this.dealList(parameter.numArr)
		_this.setData({
			numArr : _that.numData
		},function(){
			c = 135*19
			_that.allRun()
		})
		ListHeight = 134*10;
		tow = ListHeight;
	}
	dealList(){
		let len = this.numArr.length;
		let numArr = this.numArr;
		for (var i = 0; i < len; i++) {
			numArr[i].oneTop = 0;
			numArr[i].top = 0;
			numArr[i].towTop = ListHeight;
			numArr[i].targetTop = false;
			numArr[i].targetBox = ''
		}
		return numArr;
	}
	allRun(){
		moveNum  += 10;
		var top = moveNum
		let numData = _that.numData;
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
			
		}
		_this.setData({
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
				// requestAnimationFrame(()=>{_that.allRun()});
				// doAnimationFrame(()=>{_that.allRun()});
				 setTimeout(()=>{_that.allRun()},1000/60);
				if(moved.length == numData.length){
					move = false
				} 
			}else{
				_that.callback(_this)
			}
		})
	}
	stop(num){
		console.log('-----',num)
		if(!stoped){
			return
		}
		stoped = false;
		let index =	Math.ceil(moveNum/ListHeight);
		let box = index%2 == 1?'tow':'one';//当前所在
		let len = num.length;
		for (var i = 0; i < len; i++) {
			let number = parseInt(num.slice(i,i+1));
			_that.numData[i].targetMove = index*ListHeight+number*135;
			_that.numData[i].targetTop = number*135;
			_that.numData[i].targetBox = box;
		}
	}
	

}