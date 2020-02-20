import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
	/***********域名相关变量全局****************/	
		versionNumber:'1.1.8.190806',
		
		//BaseUrl
		// myBaseUrl:'https://ry-api.cn1.utools.club',//开发环境域名
		// pswEncode:"pigxpigxpigxpigx",//开发登录加密
		// pswEncode: 'yjhtyjhtyjhtyjht',	// 测试登录加密
		myBaseUrl:'https://api.youjiahu.com',//生产环境域名
		pswEncode:"VFBVbNlbNYz6j8z2",//生产登录加密
		
		//myBaseUrl:'https://ry-api.utools.club',
		//myBaseUrl:'https://api.youjiahu.cn',
		// myBaseUrl: 'https://apitest.ry600.site',
		// myBaseUrl:'http://192.168.1.64:18003',//  /auth/ 改为 /nursing-auth/，/admin/ 改为 /nursing-upms/
		//myBaseUrl:'http://ry600.vicp.io:37346', 
		//myBaseUrl:'http://192.168.1.135:7200',
		// myBaseUrl:'http://20o41004z2.iask.in:13059',//190821
		
		//devUrl
		nursing_auth:'/nursing-auth',
		nursing_upms:'/nursing-upms',
		devUrl:'/nursing-admin',
		//devUrl:'/nursing-admin-hgx',
		//devUrl:'/nursing-admin-linbc',
		//devUrl:'/nursing-admin-guozh',
		//devUrl:'/nursing-admin-liangs',
		
		//fileUrl
		// fileUrl:'https://ry-file.cn1.utools.club',
		fileUrl: 'https://filetest.ry600.site',
	/***********业务相关变量全局****************/	
		//myPhone
		myPhone:Number,//info表
		userPhone:Number,//user表
		checkPsw:Boolean,//是否记住密码
		codeTime: null,
		//验证步骤
		stepCurrent:0,
		//认证staffType 人员类型
		staffType:Number,
		saveArr_s1:Object,//认证步骤1所存数据
		saveArr_s2:[],//认证步骤2所存数据 **将step2和step3数组saveArr_s2，saveArr_s3合并成saveArr_s3 190723**（再好的代码也经不住反复改QAQ）
		saveArr_s3:[],//认证步骤3所存数据
		scanUserInfo: {},
		
		//stempImgArr,certTypeArr 步骤二、三临时所缓存的图片地址数组、类型数组
		tempImgArr:Array,
		certTypeArr:Array,
		
		//当前日期的index，比如今天周三，则index为3,周日为0
		newDayIndex:Number,
		//请求的该天的日期
		beginDate:String,
		//判断是新增地址操作（POST），还是修改地址操作（PUT）
		addrPostOrPut:"POST",
		
		//loading
		loading:false,
		//orderTabState,1=全部，2=待服务，3=服务中，4=已成功服务
		orderTabState:1,
		//consumeTabState,状态，0：待审核(已提交)、1：待签收、2：已完成
		consumeTabState:1,
		
		//默认地址
		defaultAddr:String,//e.g.天津市-天津市-河东区-人民医院
		position:'',
		addrArrindex:Number,//e.g.addressId
		editAddr:String,
		
		//order
		res_order:[],//接收预约单数组
		custName:'',//服务对象姓名
		
		//comsume
		res_consume:[],//接受领取单数组
		
		//护理记录单
		rec:{},
		recId:'',
		ReadRecOnly:false,//是否只读 为taskId时 可编辑 ；为'true时'不可编辑
		assessmentData: [],
		
		//首页、预约页刷新状态
		homeRefresh:0,//接单的刷新
		orderRefresh:0,//预约单相关状态的刷新
		orderDetailRefresh:0,//预约详情状态刷新
		orgRefresh:0,//入驻机构列表刷新
		orgUnJoinedRefresh:0,//未入驻的机构列表刷新
		consumeRefresh:0,//耗材列表刷新
		 
		//预约列表页、预约详情页，跳转来源 0-预约详情页 1-预约列表页
		toArrived_from:0,//确认到达
		toGoServer_from:0,//开始评估
		uploadServeDone_from:0,//上传服务记录
		
		//头像
		avatar:'',//头像
		avatarRefresh:false,//头像刷新
		
		//就诊信息详情
		detailObj:{},
		
		//忘记密码、修改密码
		resetPsw:0,//0:忘记密码 1：修改密码
		
		//微信登录相关
		wechatBindRes:false,
		wechatCode:'',
		wechatEncryptedData:'',
		wechatIv:'',
		wechatLoginCodeType:0,//微信登录获取验证码：绑定获取验证码：0；解绑获取验证码：1
		settingRefresh:0,//设置页面刷新
		loginAndBindWechatCode:'',//登录和绑定微信验证码保持一致190722
		
	//全局固定信息
		servePhone:"17707599741",
	},
	mutations: {
		/**
		 * @name 是否显示全局组件loading
		 */
		switch_loading(state){
			state.loading = !state.loading
		},
		orderTabStateAdd(state){
			if(state.orderTabState!=4){//不能超过4
				state.orderTabState ++
				state.consumeTabState ++
			}
		},
		orderTabStateReduce(state){
			if(state.orderTabState!=1){//不能小于1
				state.orderTabState --
				state.consumeTabState --
			}
		}
	},
	actions: {
		 
	}
})

export default store
