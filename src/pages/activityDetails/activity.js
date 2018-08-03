const util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        activityId: null,
        info: {},
        markShow: false,
        presonModalShow: false, // 显示已报名人弹窗
        signUpShow: false, // 显示立即报名弹窗
        tip: '报名成功', // 提示文字 报名失败 网络粗错了，请稍后再试
        tipSrc: '../images/public/error.png', // 提示图片 success.png https://web.krspace.cn/kr-meeting/images/activity/icon_i.png
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
                this.setData({
                    info: {
                        "address": "测试内容nd7a",
                        "beginDate": "测试内容z2gc",
                        "beginTime": "测试内容brkf",
                        "canJoin": false,
                        "content": "测试内容33t1",
                        "coverPic": "测试内容2tm2",
                        "endDate": "测试内容aet7",
                        "endTime": "测试内容80p1",
                        "isBind": true,
                        "isExpire": false,
                        "joinCount": "测试内容l5j4",
                        "joiners": [
                            {
                                "wechatAvatar": "测试内容ge0b",
                                "wechatId": 56346,
                                "wechatNick": "测试内容i6j2"
                            }
                        ],
                        "latitude": "测试内容0kc5",
                        "limitCount": 56307,
                        "longtitude": "测试内容4wpf",
                        "notice": "测试内容hl75",
                        "partners": [
                            {
                                "partnerLogo": "测试内容727h"
                            }
                        ],
                        "price": 41671,
                        "sharePic": "测试内容o570",
                        "site": "测试内容9r2f",
                        "sponsorIntro": "测试内容jv08",
                        "sponsorLogo": "测试内容9h84",
                        "sponsorName": "测试内容7j9e",
                        "title": "测试内容wu13"
                    }
                })
            },
            fail: (res) => {
                console.log(1)
            }
        })
    },
    onShareAppMessage(res) {
        return {
            title: "开启轻松、灵活办公新方式",
            desc: "氪空间自由座",
            path: "pages/activityDetails/activity",
            imageUrl: "../images/share_pic.jpg"
        };
    },
    getPresonList() {
        this.setData({
            markShow: true,
            presonModalShow: true
        })
    },
    signUpShow() {
        this.setData({
            markShow: true,
            signUpShow: true
        })
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
    },
    setTip(type, txt) {
        if ( type === 'tip' ) {
            this.setData({
                tip: txt,
                tipShow: true
            })
        }
        setTimeout(() => {
            this.setData({
                tip: '',
                tipShow: false
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
    }
})