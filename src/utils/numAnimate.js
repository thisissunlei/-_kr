/*
  点击停止的动画
  参数传入：{
  	_this:this指针,
  	callback:执行stop函数后的回调

  }
  
*/
// 是否转动
let run = true
let wx_this;
let wx_that;
export class demoAnimates {
	constructor(parameter) {
		this.callback = parameter.callback;
		wx_this = parameter._this;
		wx_that = this;
		this.WXAniamtion();
	}
	WXAniamtion() {
		let that = this;
		var animationData = wx.createAnimation({
			duration: 400,
		});
		var animationDataTwo = wx.createAnimation({
			duration: 400,
		});
		// 第二个
		var animationCloudData = wx.createAnimation({
			duration: 400,
		});
		animationData.translateY(-670).step({
			duration: 2000
		}).translateY(603).step({
			duration: 200
		}).translateY(0).step({
			duration: 1800
		});
		animationDataTwo.translateY(-670).step({
			duration: 2000
		}).translateY(603).step({
			duration: 200
		}).translateY(0).step({
			duration: 1800
		});

		animationCloudData.translateY(-670).step({
			duration: 2000
		}).translateY(-1340).step({
			duration: 2000
		}).translateY(0).step({
			duration: 10
		});
		wx_this.setData({
			animationCloudData: animationCloudData.export(),
			animationDataOne: animationData.export(),
			animationDataTwo: animationDataTwo.export(),

		}, function() {
			if (run) {

				setTimeout(function() {
					wx_that.WXAniamtion()
				}, 4100)

			} else {
				setTimeout(function() {
					wx_that.endAnimation()
				}, 4000)

			}
		})

	}
	stop(num) {
		if (!run) {
			return
		}
		run = false;
		this.number = num
	}
	endAnimation() {
		let one = -(parseInt(wx_that.number.slice(0, 1)) * 67)
		let two = -(parseInt(wx_that.number.slice(1, 2)) * 67)
		let oneTime = parseInt(wx_that.number.slice(0, 1)) * 200;
		let twoTime = parseInt(wx_that.number.slice(1, 2)) * 200;
		var animationData = wx.createAnimation({
			duration: 400,
		});
		let time = twoTime>oneTime?twoTime:oneTime
		// 第二个
		var animationCloudData = wx.createAnimation({
			duration: 400,
		});
		animationData.translateY(one).step({
			duration: oneTime
		});
		animationCloudData.translateY(two).step({
			duration: twoTime
		});

		wx_this.setData({
			animationDataOne: animationData.export(),
			animationDataTwo: animationCloudData.export(),
		}, function() {
			console.log('==========',time)
			setTimeout(function(){
				wx_that.callback(wx_this)
			},time)
			
		})
	}


}


// 传入数值自动转到动画
let _this;
let img_H = 50
let img_time = 30
export class demoAnimate {
	constructor(parameter) {
		_this = parameter._this;
	}
	initNum(num) {
		console.log('======',num)
		if (parseInt(num) == 0) {
			return;
		}
		let one = num.slice(0, 1);
		let two = num.slice(1, 2);
		let three = num.slice(2, 3);
		let animationDataOne = ''
		let animationDataTwo = ''
		let animationDataThree = ''
		animationDataOne = this.setClass(animationDataOne,one);
		animationDataTwo = this.setClass(animationDataTwo,two);
		animationDataThree = this.setClass(animationDataThree,three);
		console.log('initNum',animationDataThree)
		// let one_y, two_y, three_y, one_time, two_time, three_time;
		// if (one == 0) {
		// 	one_y = -(10*img_H);
		// 	one_time = 10*img_time;
		// } else {
		// 	one_y =  -(img_H * one);
		// 	one_time = img_time * one
		// }
		// if (two == 0) {
		// 	two_time = 10*img_time;
		// 	two_y = -(10*img_H);
		// } else {
		// 	two_time = two*img_time;
		// 	two_y = -(img_H * two)
		// }
		// if (three == 0) {
		// 	three_time = 10*img_time;
		// 	three_y = -(img_H*10);
		// } else {
		// 	three_time = img_time*three;
		// 	three_y = -(img_H * three)
		// }
		// var animationDataOne = wx.createAnimation({
		// 	duration: 400,
		// });
		// var animationDataTwo = wx.createAnimation({
		// 	duration: 400,
		// });
		// // 第二个
		// var animationDataThree = wx.createAnimation({
		// 	duration: 400,
		// });
		// animationDataOne.translateY(one_y).step({
		// 	duration: one_time
		// });
		// animationDataTwo.translateY(two_y).step({
		// 	duration: two_time
		// });
		// animationDataThree.translateY(three_y).step({
		// 	duration: three_time
		// });
		// console.log('init',one_y,one)
		_this.setData({
			// animationDataOne: animationDataOne.export(),
			// animationDataTwo: animationDataTwo.export(),
			// animationDataThree: animationDataThree.export()
			animationDataOne: animationDataOne,
			animationDataTwo: animationDataTwo,
			animationDataThree: animationDataThree
		})



	}
	setClass(name,num){
		console.log('set--->',num)
		switch (num){
			case '0':
				name = 'move-zero'
				break;
			case '1':
				name = 'move-one'
				break;
			case '2':
				name = 'move-two'
				break;
			case '3':
				name = 'move-three'
				break;
			case '4':
				name = 'move-four'
				break;
			case '5':
				name = 'move-five'
				break;
			case '6':
				name = 'move-six'
				break;
			case '7':
				name = 'move-seven'
				break;
			case '8':
				name = 'move-eight'
				break;
			case '9':
				name = 'move-nine'
				break;
			default:
				name = 'move-zero'
				break;
		}
		return name;
	}

}