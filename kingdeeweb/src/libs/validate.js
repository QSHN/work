const validatePhoneCheck = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确手机号码'))
  } else {
    callback()
  }
}

const validatePassCheck = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入6-10位字母或数字的密码'))
  } else if (!/^[a-zA-Z0-9]{6,10}$/.test(value)) {
    callback(new Error('请输入6-10位字母或数字的密码'))
  } else {
    callback()
  }
}

export {
  validatePhoneCheck,
  validatePassCheck
}
