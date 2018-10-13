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
			wx_that.callback(wx_this)
		})
	}


}