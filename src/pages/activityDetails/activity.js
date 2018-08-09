const util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        activityId: null,
        info: {},
        beginTime: {},
        endTime: {},
        markShow: false,
        presonModalShow: false, // 显示已报名人弹窗
        signUpShow: false, // 显示立即报名弹窗
        tip: '报名成功', // 提示文字 报名失败 网络粗错了，请稍后再试
        tipSrc: '', // 提示图片 success.png https://web.krspace.cn/kr-meeting/images/activity/icon_i.png
        tipWidth: 280, // 提示宽度 280 424
        tipShow: false,
        apiTipShow: false,
        signUpData: {
            activityId: '', // 活动
            companyName: '', // 公司
            name: '', // 姓名
            phone: '' // 手机号
        },

        canJoin: true, // 是否可以报名
        full: false, // 人数已满
        expire: false, // 是否过期
        exist: false // 是否已经报名
    },
    onLoad(options) {
        this.setData({
            activityId: options.activityId || 0,
            ['signUpData.activityId']: options.activityId || 0
        })
        wx.showLoading({
            title: "加载中",
            mask: true
        });
    },
    onShow() {
        if ( !!app.globalData.Cookie ) {
            this.getDetail()
        } else {
            this.loginAgain()
        }
    },
    loginAgain() {
        wx.login({
            success: (res) => {
                if (res.code) {
                    app.getRequest({
                        url: app.globalData.KrUrl + "api/gateway/krmting/common/login",
                        methods: "GET",
                        data: {
                            code: res.code
                        },
                        success: (logRes) => {
                            app.globalData.Cookie = logRes.header["Set-Cookie"] || logRes.header["set-cookie"];
                            this.getDetail()
                        },
                        fail: (logRes) => {
                            this.setTip('netTip', '网络粗错了，请稍后再试', 'https://web.krspace.cn/kr-meeting/images/activity/icon_i.png')
                        }
                    })
                } else {
                    console.log("登录失败！" + res.errMsg);
                }
            }
        });
    },
    getDetail() {
        app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/kmactivity/detail',
            methods: "GET",
            data: {
                activityId: this.data.activityId
            },
            success: (res) => {
                if ( res.data.code == -1 ) {
                    this.setTip('apiTip', res.data.message, '../images/public/error.png')
                } else {
                    res.data.data.content = res.data.data.content.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                    res.data.data.notice = res.data.data.notice.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
                    let full = false, expire = false, exist = false
                    if ( !!res.data.data.enterStatus && res.data.data.enterStatus.length > 0 ) {
                        if ( res.data.data.enterStatus.join(',').indexOf('EXPIRED') > -1 ) {
                            expire = true
                        } else if ( res.data.data.enterStatus.join(',').indexOf('EXIST') > -1 ) {
                            exist = true
                        } else if ( res.data.data.enterStatus.join(',').indexOf('FULL') > -1 ) {
                            full = true
                        }
                    }
                    this.setData({
                        info: res.data.data,
                        canJoin: res.data.data.canJoin, // 是否可以报名
                        full: full, // 人数已满
                        expire: expire, // 是否过期
                        exist: exist, // 是否已经报名
                        signUpData: {
                            activityId: this.data.activityId, // 活动
                            companyName: res.data.data.companyName, // 公司
                            name: res.data.data.name, // 姓名
                            phone: res.data.data.phone // 手机号
                        }
                    })
                }
                wx.setNavigationBarTitle({
                    title: this.data.info.title
                })
                wx.hideLoading();
                this.getTime('beginTime', this.data.info.beginTime)
                this.getTime('endTime', this.data.info.endTime)
            },
            fail: (res) => {
                this.setTip('netTip', '网络粗错了，请稍后再试', 'https://web.krspace.cn/kr-meeting/images/activity/icon_i.png')
            }
        })
    },
    getUserInfo() {
        app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/krmting/getWecharUser',
            methods: "GET",
            success: (res) => {
                if ( res.data.code == -1 ) {
                    this.setTip('apiTip', res.data.message, '../images/public/error.png')
                } else {

                }
            },
            fail: (res) => {
                this.setTip('netTip', '网络粗错了，请稍后再试', 'https://web.krspace.cn/kr-meeting/images/activity/icon_i.png')
            }
        })
    },
    onShareAppMessage(res) {
        return {
            title: this.data.info.title,
            desc: "氪空间自由座",
            path: "pages/activityDetails/activity?activityId=" + this.data.activityId,
            imageUrl: this.data.info.sharePic
        };
    },
    getPresonList() {
        this.setData({
            markShow: true,
            presonModalShow: true
        })
    },
    signUpShow() {
        if ( !!this.data.info.bind ) {
            this.setData({
                markShow: true,
                signUpShow: true
            })
        } else {
            wx.navigateTo({
                url: "../bindPhone/bindPhone?from=activity"
            });
        }
    },
    modalHide() {
        if ( !!this.data.tipShow || !!this.data.apiTipShow ) {
            return
        }
        this.setData({
            markShow: false,
            presonModalShow: false,
            signUpShow: false
        })
    },
    bindKeyInputName(e) {
        this.setData({
            ['signUpData.name']: e.detail.value
        })
    },
    bindKeyInputPhone(e) {
        this.setData({
            ['signUpData.phone']: e.detail.value
        })
    },
    bindKeyInputCompanyName(e) {
        this.setData({
            ['signUpData.companyName']: e.detail.value
        })
    },
    signUp() {
        if ( !!this.data.tipShow || !!this.data.apiTipShow ) {
            return
        }
        let phoneTest = util.phone(this.data.signUpData.phone)
        if ( !this.data.signUpData.name.trim() ) {
            this.setTip('tip', '请输入姓名')
            return
        } else if ( !this.data.signUpData.phone.trim() ) {
            this.setTip('tip', '请输入手机号')
            return
        } else if ( !phoneTest ) {
            this.setTip('tip', '手机号格式错误')
            return
        } else if ( !this.data.signUpData.companyName.trim() ) {
            this.setTip('tip', '请输入公司名称')
            return
        }

        app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/kmactivity/join/signup',
            methods: "GET",
            data: this.data.signUpData,
            success: (res) => {
                if ( res.data.code == -1 ) {
                    this.setTip('apiTip', res.data.message, '../images/public/error.png')
                } else {
                    this.setTip('apiTip', '报名成功', '../images/public/success.png')
                    setTimeout(() => {
                        this.setData({
                            markShow: false,
                            signUpShow: false
                        })
                        wx.navigateTo({
                            url: '../activityQuickMark/activityQuickMark?joinId=' + res.data.data.joinId,
                        })
                    }, 2000)
                }
            },
            fail: (res) => {
                this.setTip('netTip', '网络粗错了，请稍后再试', 'https://web.krspace.cn/kr-meeting/images/activity/icon_i.png')
            }
        })
    },
    setTip(type, txt, icon) {
        if ( type === 'tip' ) {
            this.setData({
                tip: txt,
                tipShow: true
            })
        } else if (type === 'apiTip') {
            this.setData({
                tip: txt,
                tipSrc: icon,
                tipWidth: 280,
                apiTipShow: true
            })
        } else {
            this.setData({
                tip: txt,
                tipSrc: icon,
                tipWidth: 424,
                apiTipShow: true
            })
        }
        setTimeout(() => {
            this.setData({
                tip: '',
                tipSrc: '',
                tipShow: false,
                apiTipShow: false
            })
        }, 2000)
    },
    clearNameInput() {
        this.setData({
            ['signUpData.name']: ''
        })
    },
    clearPhoneInput() {
        this.setData({
            ['signUpData.phone']: ''
        })
    },
    getTime(state, time) {
        let week = '',y = new Date().getFullYear(), M = '', d = '', h = '00', m = '00', day
        if ( !!time ) {
            switch ( new Date(parseInt(time)).getDay() ) {
                case 0:week="周日";break
                case 1:week="周一";break
                case 2:week="周二";break
                case 3:week="周三";break
                case 4:week="周四";break
                case 5:week="周五";break
                case 6:week="周六";break
            }
            y = new Date(parseInt(time)).getFullYear()
            M = new Date(parseInt(time)).getMonth()+1 >= 10 ? new Date(parseInt(time)).getMonth()+1 : '0' + (new Date(parseInt(time)).getMonth()+1)
            d = new Date(parseInt(time)).getDate() >= 10 ? new Date(parseInt(time)).getDate() : '0' + new Date(parseInt(time)).getDate()
            h = new Date(parseInt(time)).getHours() >= 10 ? new Date(parseInt(time)).getHours() : '0' + new Date(parseInt(time)).getHours()
            m = new Date(parseInt(time)).getMinutes() >= 10 ? new Date(parseInt(time)).getMinutes() : '0' + new Date(parseInt(time)).getMinutes()
        }
        day = {
            y: y,
            d: M + '月' + d + '日' + ' (' + week + ')',
            t: h + ':' + m
        }
        this.setData({
            [state]: day
        })
    },
    jumpToMap() {
        wx.setStorage({
            key:"mapOptions",
            data:{
                latitude: this.data.info.latitude,
                longtitude: this.data.info.longtitude,
                address: this.data.info.address,
                site: this.data.info.site
            },
            success: () => {
                wx.navigateTo({
                    url: '../locationMap/locationMap'
                });
            }
        })
    },
    imgError(e) {
        this.setData({
            ['info.'+e.target.id]: ''
        })
    }
})