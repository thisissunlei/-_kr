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
        }
    },
    onLoad(options) {
        this.setData({
            activityId: options.activityId || 0
        })
        this.getDetail()
    },
    getDetail() {
        app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/kmactivity/detail',
            methods: "GET",
            data: {
                activityId: this.data.activityId
            },
            success: (res) => {
                console.log(res)
                // if ( res.data.code == -1 ) {} else {}

                this.setData({
                    info: {
                        "address": "地址",
                        "beginDate": "测试内容z2gc",
                        "beginTime": 1533275560000,
                        "canJoin": true,
                        "content": "测试内容33t1",
                        "coverPic": "测试内容2tm2",
                        "endDate": "测试内容aet7",
                        "endTime": 1533225600000,
                        "isBind": true,
                        "isExpire": false,
                        "joinCount": 8,
                        "joiners": [
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"},
                            {"wechatAvatar": "../images/share_pic.jpg"}
                        ],
                        "latitude": "测试内容0kc5",
                        "limitCount": 10,
                        "longtitude": "测试内容4wpf",
                        "notice": "测试内容hl75",
                        "partners": [
                            {
                                "partnerLogo": "../images/share_pic.jpg"
                            },
                            {
                                "partnerLogo": "../images/share_pic.jpg"
                            }
                        ],
                        "price": 0,
                        "sharePic": "../images/share_pic.jpg",
                        "site": "测试内容9r2f",
                        "sponsorIntro": "测试内容jv08",
                        "sponsorLogo": "../images/share_pic.jpg",
                        "sponsorName": "测试内容7j9e",
                        "title": "测试内容wu13"
                    }
                })
                wx.setNavigationBarTitle({
                    title: this.data.info.title
                })
                this.getTime('beginTime', this.data.info.beginTime)
                this.getTime('endTime', this.data.info.endTime)
            },
            fail: (res) => {
                console.log(1)
            }
        })
    },
    onShareAppMessage(res) {
        return {
            title: this.data.info.title,
            desc: "氪空间自由座",
            path: "pages/activityDetails/activity",
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
        if ( !!this.data.info.isBind ) {
            this.setData({
                markShow: true,
                signUpShow: true
            })
        } else {
            wx.navigateTo({
                url: '../bindPhone/bindPhone'
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

        this.setData({
            markShow: false,
            signUpShow: false
        })

        app.getRequest({
            url: app.globalData.KrUrl + 'api/gateway/kmactivity/detail',
            methods: "GET",
            data: this.data.signUpData,
            success: (res) => {
                if ( res.data.code == -1 ) {
                    this.setTip('apiTip', res.message, '../images/public/error.png')
                } else {
                    this.setTip('apiTip', '报名成功', '../images/public/success.png')
                    setTimeout(() => {
                        this.setData({
                            markShow: false,
                            signUpShow: false
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
        let week = ''
        switch ( new Date(parseInt(time)).getDay() ) {
            case 0:week="周日";break
            case 1:week="周一";break
            case 2:week="周二";break
            case 3:week="周三";break
            case 4:week="周四";break
            case 5:week="周五";break
            case 6:week="周六";break
        }
        let h = new Date(parseInt(time)).getHours() >= 10 ? new Date(parseInt(time)).getHours() : '0' + new Date(parseInt(time)).getHours()
        let m = new Date(parseInt(time)).getMinutes() >= 10 ? new Date(parseInt(time)).getMinutes() : '0' + new Date(parseInt(time)).getMinutes()
        let day = {
            y: new Date(parseInt(time)).getFullYear(),
            d: new Date(parseInt(time)).getMonth() + 1 + '月' + new Date(parseInt(time)).getDate() + '日' + '（' + week + '）',
            t: h + ':' + m
        }
        this.setData({
            [state]: day
        })
    }
})