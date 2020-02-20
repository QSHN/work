
function alert (error) {
  if (error && error.errorMsg) {
    console.log(error.errorMsg)
  }
}

const errorCodeList = {
  '1001': { action: alert, callback: 'stop' }
}

export const disposeError = (error) => {
  let { errorCode } = error
  if (errorCodeList[errorCode]) {
    let dis = errorCodeList[errorCode]
    if (dis.action) dis.action(error) // 针对错误码执行一些特定操作
    if (dis.callback) return dis.callback // 返回接下来操作指命
  }
}
