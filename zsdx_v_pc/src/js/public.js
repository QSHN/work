import iziToast from 'izitoast'
// 验证码
export const createCode = () => {
  let code = ''
  // 生成一个随机数
  let randomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  // 生成一个随机色
  let randomColor = function (min, max) {
    let r = randomNum(min, max)
    let g = randomNum(min, max)
    let b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }

  // 绘制验证码图片
  let drawPic = function () {
    let canvas = document.getElementById('code_canvas')
    let width = canvas.width
    let height = canvas.height
    let ctx = canvas.getContext('2d')

    // 绘制背景色
    ctx.fillStyle = randomColor(180, 240)  // 颜色若太深可能导致看不清
    ctx.fillRect(0, 0, width, height)

    // 绘制文字
    let str = 'ABCEFGHJKLMNPQRSTWXY123456789'
    for (let i = 0; i < 4; i++) {
      let txt = str[randomNum(0, str.length)]
      ctx.fillStyle = randomColor(50, 160)          // 随机生成字体颜色
      // ctx.font = randomNum(20, 30) + 'px'        // 随机生成字体大小
      ctx.font = '35px SimHei'

      let x = 6 + i * 25
      let y = 28
      let deg = randomNum(-20, 20)

      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)

      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)

      code += txt
    }

    // 绘制干扰线
    for (let i = 0; i < 2; i++) {
      ctx.strokeStyle = randomColor(40, 180)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(randomNum(3, 6), randomNum(0, height))
      ctx.quadraticCurveTo(randomNum(0, width), randomNum(0, height), 106, randomNum(0, height))
      ctx.stroke()
    }

    // 绘制干扰点
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
      ctx.fill()
    }

    return code
  }
  return drawPic()
}

// 发送数据接口
export const sendDataFuc = (self, url, data, success) => {
  let domainName = '/xlearn'
  self.$store.commit('LOADING_STATUS', true)
  self.$http.get(domainName + url, {params: data}).then((response) => {
    // 响应成功回调
    success(response.body)
    self.$store.commit('LOADING_STATUS', false)
  }, (response) => {
    // 响应错误回调
    console.log(2, response)
    globalPrompt('error', response.statusText)
    self.$store.commit('LOADING_STATUS', false)
  })
}

// 验证账号格式
export const isTrueUser = (obj, type) => {
  let mail = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/
  let tel = /^1[34578]\d{9}$/
  return type === undefined
    ? tel.test(obj) || mail.test(obj)
    : type ? tel.test(obj) : mail.test(obj)
}

// 全局提示
export const globalPrompt = (type, content) => {
  switch (type) {
    case 'success' :
      iziToast.success({
        title: 'OK',
        position: 'bottomCenter',
        message: content
      })
      break
    case 'warning' :
      iziToast.warning({
        title: 'Caution',
        position: 'bottomCenter',
        message: content
      })
      break
    case 'error' :
      iziToast.error({
        title: 'Error',
        position: 'bottomCenter',
        message: content
      })
      break
  }
}

// 判断密码强度
export const checkPassword = (val) => {
  let modes = 0
  if (val.length === 0) return -1
  if (val.length < 6) return -2

  if (/\d/.test(val)) modes++       // 数字
  if (/[a-z]/.test(val)) modes++    // 小写
  if (/[A-Z]/.test(val)) modes++    // 大写
  if (/\W/.test(val)) modes++       // 特殊字符
  if (val.length > 12) modes++
  return modes
}

// 判断鼠标进来离开的方向
export const getMouseDirection = (e, self) => {
  let w = self.offsetWidth
  let h = self.offsetHeight
  let x = (e.pageX - self.offsetLeft - (w / 2) * (w > h ? (h / w) : 1))
  let y = (e.pageY - self.offsetTop - (h / 2) * (h > w ? (w / h) : 1))
  let d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4
  return d
}

// 根据鼠标进来离开的方向添加class
export const addMouseClass = (e, self, state) => {
  let direction = getMouseDirection(e, self)
  let classSuffix = ''
  self.className = ''
  switch (direction) {
    case 0 :
      classSuffix = '-top'
      break
    case 1 :
      classSuffix = '-right'
      break
    case 2 :
      classSuffix = '-bottom'
      break
    case 3 :
      classSuffix = '-left'
      break
  }
  self.classList.add(state + classSuffix)
}

export default {
  createCode,                   // 创建二维码
  sendDataFuc,                  // 发送数据接口
  isTrueUser,                   // 检测账户格式
  globalPrompt,                 // 全局提示
  checkPassword,                // 判断密码强度
  addMouseClass                 // 根据鼠标进来离开的方向添加class
}
