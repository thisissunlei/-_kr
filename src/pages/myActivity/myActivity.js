//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        list: [],
        bg: '../images/my/bg.png'
    },
    onLoad: function () {
        let that = this;
        // wx.reportAnalytics('viewmeeting')
        app.getRequest({
            url: app.globalData.KrUrl+'api/gateway/kmactivity/my/list',
            methods: "GET",
            data: {
                pageSize:100
            },
            success: ( res ) => {
                if( res.data.code > 0 ){
                    that.setData({
                        list: []
                    })
                    if ( !!res.data.data && res.data.data.length > 0 ) {
                        that.setData({
                            list: res.data.data || []
                        })
                        that.data.list.forEach((val, i) => {
                            that.getTime('bt', val.beginTime, i)
                            that.getTime('et', val.endTime, i)
                        })
                    }
                }
            },
            fail:(res)=>{
                //  console.log('========',res)
            }
        })
    },
    getTime(state, time, i) {
        let list = this.data.list
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
            M = new Date(parseInt(time)).getMonth()
            d = new Date(parseInt(time)).getDate()
            h = new Date(parseInt(time)).getHours() >= 10 ? new Date(parseInt(time)).getHours() : '0' + new Date(parseInt(time)).getHours()
            m = new Date(parseInt(time)).getMinutes() >= 10 ? new Date(parseInt(time)).getMinutes() : '0' + new Date(parseInt(time)).getMinutes()
        }
        day = {
            y: y,
            d: M + 1 + '-' + d + ' (' + week + ')',
            t: h + ':' + m
        }
        list[i][state] = day

        this.setData({
            list: list
        })
        console.log(this.data.list)
    }
})
