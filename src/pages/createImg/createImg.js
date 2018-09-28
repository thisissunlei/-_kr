//index.js
import Poster from '../wxa-plugin-canvas/poster/poster';
const app = getApp();
Page({
    data: {
        showSuccess:false,
        KrImgUrl:app.globalData.KrImgUrl ,
        imgUrl:'',
        showShare:false,
        
    },
    jdConfig: {
        width: 765,
        height: 1068,
        backgroundColor: '#fff',
        debug: false,
        images: [
            {
                width: 765,
                height: 1068,
                x: 1,
                y: 0,
                borderRadius: 16,
                url: '/pages/images/shareBg.png',
                zIndex:2
            },
        ]
    },
    weImg:{
        width: 486,
        height: 486,
        x: 141,
        y: 390,
        url: '',
        zIndex:1
    },
    closeDialog(){
        this.setData({
            showShare:false,
            showSuccess:false
        })
    },
    saveImg(){
        //保存图片到本地
        let that = this;
        // wx.saveImageToPhotosAlbum({
        //     filePath: that.data.imgUrl,
        //     success:function(res){
        //         console.log('success',res)
                that.setData({
                    showShare:false,
                    showSuccess:true
                })
        //     },
        //     fail:function(res){
        //         console.log('fail',res)
        //     }
        // }, this)
        //保存图片到本地--end
    },
    onPosterSuccess(e) {
        const { detail } = e;
        wx.hideLoading();
        this.setData({
            imgUrl:detail,
            showShare:true
        })
    },
    onPosterFail(err) {
        console.error(err);
    },
    
    createShareCanvas(){
        let weImg = this.weImg
        let jdConfig = this.jdConfig
        let that = this;
        wx.showLoading({
          title: "加载中"
        });


        app.getRequest({
          url: app.globalData.KrUrl + "api/gateway/kmbooster/promocode",
          data:{
            page:'pages/activityDetails/activity',
            scene:'8'
          },
          success: res => {
            let code = res.data.code;
            if(code===1){
                // weImg.url = res.data.data
                weImg.url = '/pages/images/shi.jpg'
                jdConfig.images.push(weImg)
                this.setData({
                    jdConfig:jdConfig,
                },function(){
                    Poster.create();
                    
                })
            }else{
                // weImg.url = res.data.data
                weImg.url = 'https://img.krspace.cn/activity/image/0/2018/09/25/115630761C2e8epT.jpg'
                jdConfig.images.push(weImg)
                this.setData({
                    jdConfig:jdConfig,
                },function(){
                    Poster.create();
                    
                })
            }
            

          }
        })

        
           
    },

    /**
     * 异步生成海报
     */
    onCreatePoster() {
        Poster.create();
    }
})
