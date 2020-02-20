export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '三帆外勤原生',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  // useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://192.168.0.123:8089',
    // dev: 'http://192.168.0.192:8089',
    // dev: 'http://47.107.165.66:8289',
    pro: 'http://47.107.165.66:8289'
  },
  // 融云的key值
  rongAppKey: {
    dev: 'lmxuhwagl50cd',
    pro: 'z3v5yqkbzi4u0'
  },
  lieying: {
    host: 'https://tsapi.amap.com/v1/track',
    key: '3c80f99eeb5fc53c651602c56d85b258'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
