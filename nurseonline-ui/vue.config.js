const url = 'http://yjh.caochuanxi.com';
// const url = "http://ry600.vicp.io:37346";
// const url = "https://ry-api.utools.club";
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT'
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },
  // 配置转发代理
  devServer: {
    proxy: {
      '/nursing': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/nursing': '/nursing-admin'
        }
      },
      '/auth': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/auth': '/nursing-auth'
        }
      },
      '/admin': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/admin': '/nursing-upms'
        }
      },
      '/code': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/code': '/code'
        }
      },
      '/gen': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/gen': '/gen'
        }
      },
      '/daemon': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/daemon': '/daemon'
        }
      },
      '/tx': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/tx': '/tx'
        }
      },
      '/act': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/act': '/act'
        }
      }
    }
  }
}