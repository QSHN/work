import Vue from 'vue'
let vm=new Vue()

export const  v_username= async (username)=>{
	let validInfo;//提示信息
	//格式校验
	if (username==''){
		validInfo='用户名不能为空'
	}else{
		if(escape(username).indexOf("%u")!=-1){
			validInfo='用户名不能含有汉字'
		}else if(!/^[a-zA-Z]+$/.test(username.substr(0,1))){
			validInfo='用户名首位必须是字母'
		}else if(username.length<4||username.length>20){
			validInfo='用户名长度需4-20位'
		}else if(!/^[A-Za-z][A-Za-z0-9_]{3,19}$/.test(username)){
			validInfo='用户名由字母、数字和下划线组成'
		}else{
			//存在校验
			let res;
			try{
				res = await vm.$api.onlyName(username);
				if(JSON.parse(res.data).data==false){
					validInfo='用户名已被注册'
				}else{
					validInfo='用户名可用于注册'//可用来注册
				}
			}catch(e){
				//TODO handle the exception
				validInfo=(JSON.parse(e.data)).msg //后台调整接口如果报500，进行拦截190626
			}
		}
	}
	return validInfo
}

export const  v_phone= async(phone)=>{
	let validInfo;//提示信息
	if(phone==''){
		validInfo='手机号不能为空'
	}else{
		if(!/^1\d{10}$/.test(phone)){//11位以1开头的数字
			validInfo='手机号格式错误'
		}else{
			let res;
			res = await vm.$api.onlyPhone(phone);
			if(JSON.parse(res.data).data==false){
				validInfo='手机号已被注册'
			}
			else{
				validInfo='手机号可用于注册'
			}
		}	
	}
	return validInfo
}

export const  v_psw= (psw)=>{
	let validInfo;//提示信息
	if(psw==''){
		validInfo='密码不能为空'
	}else{
		if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,20}$/.test(psw)){//密码需要是8-20位数字和字母组合 //20190703
			validInfo='密码格式错误'
		}else{
			validInfo='密码格式正确'
		}	
	}
	return validInfo
}

export default {
	v_username,//校验用户名
	v_phone,//校验手机号
	v_psw,//校验密码
}
