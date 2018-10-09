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
		}
	}
}
var b=0,c=0,d=500,t=0;
var imgHeight = 120;//单独数字的高度
var ListHeight = 1200;//循环动画的高度
var index = 0
var _this ;
var _that ;
export class demoAnimate {
	constructor(parameter) {
		this.number = parameter.number;
		this.numArr = parameter.numArr;
		_this = parameter._this;
		_that = this;

		let len = this.number.length;
		this.numData = this.dealData()
		c = this.numData[index].label * imgHeight;
		this.obj = this.numData[index];
		this.Run()
	}
	dealData() {
		let len = this.number.length;
		let numArr = this.numArr;
		for (var i = 0; i < len; i++) {
			numArr[i].label = this.number.slice(i, i + 1);
			numArr[i].top = 0;
		}
		return numArr;
	}
	Run() {
		_that.obj.top = Math.ceil(Tween.Quad.easeOut(t, b, c, d));
		let numData = _that.numData
		let a = 'numArr';
		_this.setData({
			[a]: numData
		}, function() {
			if (t < d) {
				t++;
				setTimeout(_that.Run, 1);
			} else if (t == d && index < numData.length - 1) {
				index++;
				t = 0;
				c = numData[index].label * imgHeight;
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
export class demoAnimates {
	constructor(parameter) {
		this.numArr = parameter.numArr;
		_this = parameter._this;
		_that = this;
		this.numData = this.dealList(parameter.numArr)
		_this.setData({
			numArr : _that.numData
		},function(){
			c = 120*19
			_that.allRun(parameter.callback)
		})
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
	allRun(callback){
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
			if(i === 2){
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
				requestAnimationFrame(()=>{_that.allRun(callback)});
				if(moved.length == numData.length){
					move = false
				} 
			}else{
				callback(_this)
			}
		})
	}
	stop(num){
		if(!stoped){
			return
		}
		stoped = false;
		let index =	Math.ceil(moveNum/ListHeight);
		let box = index%2 == 1?'tow':'one';//当前所在
		let len = num.length;
		for (var i = 0; i < len; i++) {
			let number = parseInt(num.slice(i,i+1));
			_that.numData[i].targetMove = index*ListHeight+number*imgHeight;
			_that.numData[i].targetTop = number*imgHeight;
			_that.numData[i].targetBox = box;
		}
	}
	

}