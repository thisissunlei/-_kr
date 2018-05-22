# 微信小程序
### 1. 安装nodejs
	window:
		64位：https://npm.taobao.org/mirrors/node/latest-v6.x/node-v6.9.2-x64.msi
		32位：https://npm.taobao.org/mirrors/node/latest-v6.x/node-v6.9.2-x86.msi

	MAC:
		https://npm.taobao.org/mirrors/node/latest-v6.x/node-v6.9.2.pkg

### 2. 小程序开发环境搭建
	下载安装IDE:
		https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html	
		
	选择小程序目录 ../wechat/dist/
	
	App ID: wxc30ae3bc7fb4cab1
	
	// 安装必要的依赖
	$ sudo npm install gulp -g 
	$ sudo npm install

### 3. 开发与调试
	$ git pull (更新代码)
	$ sudo gulp （启动微信小程序服务）
	
### 4. 项目结构
```
.
├── 小程序文档
│   ├── 小程序v1.0.0 首页流程.graffle
│   ├── 小程序v1.0.0 首页流程.pdf
│   ├── 小程序v1.0.0 AQI详情页流程图.graffle
│   ├── 小程序v1.0.0 AQI详情页流程图.pdf
│   └── 搜索直达编译
│       ├── WidgetDom.zip
│       └── WidgetDom切换到模版预编译模式文档说明.pdf
├── dist // 编译好的文件
│   ├── app.js //全局入口文件
│   ├── app.json //全局配置
│   ├── app.wxss //全局样式
│   ├── pages // 小程序页面
│   │   ├── aqi
│   │   │   ├── aqi.js // aqi 逻辑处理代码
│   │   │   ├── aqi.json // aqi 配置
│   │   │   ├── aqi.wxml // aqi 模板
│   │   │   └── aqi.wxss // aqi 样式
│   │   ├── daily
│   │   │   ├── daily.js
│   │   │   ├── daily.json
│   │   │   ├── daily.wxml
│   │   │   └── daily.wxss
│   │   ├── image // 图片文件夹
│   │   │   ├── aqi //aqi图片
│   │   │   ├── icon //icon
│   │   │   ├── script //预警
│   │   │   ├── skin //背景皮肤
│   │   │   ├── warn //告警
│   │   │   ├── wea //天气图标
│   │   │   └── wind //风力
│   │   ├── index
│   │   │   ├── index.js //首页逻辑
│   │   │   ├── index.wxml //首页模板
│   │   │   └── index.wxss //首页样式
│   │   ├── short
│   │   │   ├── short.js //短时逻辑
│   │   │   ├── short.json //短时配置
│   │   │   ├── short.wxml //短时模板
│   │   │   └── short.wxss //短时样式
│   │   └── warn
│   │       ├── warn.js //告警逻辑
│   │       ├── warn.json //告警配置
│   │       ├── warn.wxml 	//告警模板
│   │       └── warn.wxss //告警样式
│   ├── searchWidget // 搜索直达服务
│   │   ├── WidgetDom // 不用修改
│   │   │   └── index.js
│   │   ├── class.js // 样式文件
│   │   ├── images // 图片
│   │   │   ├── design1.png // 1.今天天气
│   │   │   ├── design2.png // 2.一周天气（明天、后天天气）
│   │   │   └── design3.png // 3.省份天气
│   │   ├── template.compile.js // 编译好的模板代码 请参考小程序文档->搜索直达编译->WidgetDom切换到模版预编译模式文档说明.pdf
│   │   ├── template.wxml //搜索直达模板
│   │   └── widget.js //搜索直达逻辑处理
│   └── utils 
│       ├── TMPL //小程序模板
│       │   ├── IndexLiving.wxml //首页，生活指数模板
│       │   ├── aqiTMPL.wxml //aqi模板
│       │   ├── dailyTMPL.wxml //15天预报模板
│       │   ├── dayChart.wxml //15天图表模板
│       │   ├── firstScreen.wxml //首屏模板
│       │   ├── hourChart.wxml //24小时图表模板
│       │   ├── search.wxml //首页搜索模板
│       │   ├── shortChart.wxml //短时预报图表模板
│       │   └── warnTMPL.wxml //预警模板
│       ├── base.js //通用JS方法集合
│       ├── cityData.js //城市数据（搜索直达跳转小程序）
│       ├── dataFormat.js //数据格式化
│       ├── requestData.js //获取数据
│       └── scss //样式文件夹
│           ├── base.wxss //通用样式
│           ├── dayChart.wxss //15天图表样式
│           ├── firstScreen.wxss //首屏样式
│           ├── hourChart.wxss //24小时图表样式
│           ├── livingIndex.wxss //生活指数样式
│           └── search.wxss //搜索页样式
├── src //开发目录
│   ├── app.js
│   ├── app.json
│   ├── app.scss
│   ├── pages //小程序
│   │   ├── aqi
│   │   │   ├── aqi.html
│   │   │   ├── aqi.js
│   │   │   ├── aqi.json
│   │   │   └── aqi.scss
│   │   ├── daily
│   │   │   ├── daily.html
│   │   │   ├── daily.js
│   │   │   ├── daily.json
│   │   │   └── daily.scss
│   │   ├── image
│   │   │   ├── aqi
│   │   │   ├── icon
│   │   │   ├── script
│   │   │   ├── skin
│   │   │   ├── warn
│   │   │   ├── wea
│   │   │   └── wind
│   │   ├── index
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   └── index.scss
│   │   ├── short
│   │   │   ├── short.html
│   │   │   ├── short.js
│   │   │   ├── short.json
│   │   │   └── short.scss
│   │   └── warn
│   │       ├── warn.html
│   │       ├── warn.js
│   │       ├── warn.json
│   │       └── warn.scss
│   ├── searchWidget //搜索直达
│   │   ├── WidgetDom
│   │   │   └── index.js
│   │   ├── class.js
│   │   ├── images
│   │   │   ├── design1.png
│   │   │   ├── design2.png
│   │   │   └── design3.png
│   │   ├── template.html
│   │   └── widget.js
│   └── utils //工具库
│       ├── TMPL //模板
│       │   ├── IndexLiving.html
│       │   ├── aqiTMPL.html
│       │   ├── dailyTMPL.html
│       │   ├── dayChart.html
│       │   ├── firstScreen.html
│       │   ├── hourChart.html
│       │   ├── search.html
│       │   ├── shortChart.html
│       │   └── warnTMPL.html
│       ├── base.js
│       ├── cityData.js
│       ├── dataFormat.js
│       ├── requestData.js
│       └── scss //样式
│           ├── base.scss
│           ├── dayChart.scss
│           ├── firstScreen.scss
│           ├── hourChart.scss
│           ├── livingIndex.scss
│           └── search.scss
├── README.md
├── gulpfile.js //启动配置说明
└── package.json //项目依赖说明
        
```