import CryptoJS from 'crypto-js'
//身份证 加密解密
export const getAesString=(data)=>{//加密
	var key  = CryptoJS.enc.Utf8.parse("timTIMsoHANDsome");
	var iv   = CryptoJS.enc.Utf8.parse("iv0102030405060708");
	var encrypted =CryptoJS.AES.encrypt(data,key,
		{
			iv:iv,
			mode:CryptoJS.mode.ECB,
			padding:CryptoJS.pad.Pkcs7
		});
		
	return encrypted.toString();    //返回的是base64格式的密文
}
export const getDAesString=(encrypted)=>{//解密
	var key  = CryptoJS.enc.Utf8.parse("timTIMsoHANDsome");
	var iv   = CryptoJS.enc.Utf8.parse("iv0102030405060708");
	var decrypted =CryptoJS.AES.decrypt(encrypted,key,
		{
			iv:iv,
			mode:CryptoJS.mode.ECB,
			padding:CryptoJS.pad.Pkcs7
		});
	return decrypted.toString(CryptoJS.enc.Utf8);     
}

//账户密码登录加密
export const encryption = (params) => {
  let { data,type,param,key} = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}
//VFBVbNlbNYz6j8z2
//pigxpigxpigxpigx
export const getDAesStringLogin=(encrypted)=>{//解密 登录密码
	var key  = CryptoJS.enc.Utf8.parse("pigxpigxpigxpigx");
	var iv   = CryptoJS.enc.Utf8.parse("pigxpigxpigxpigx");
	var decrypted =CryptoJS.AES.decrypt(encrypted,key,
		{
			iv:iv,
			mode:CryptoJS.mode.ECB,
			padding:CryptoJS.pad.Pkcs7
		});
	return decrypted.toString(CryptoJS.enc.Utf8);     
}

export default {
	getAesString,//加密
	getDAesString,//解密
	encryption,//账户密码登录加密
	getDAesStringLogin//解密 登录密码
}
