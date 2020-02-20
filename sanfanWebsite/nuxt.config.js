const pkg = require('./package')
const resolve = require('path').resolve

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: '三帆外勤官网',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          '移动OA系统,考勤系统,考勤系统软件,移动办公软件,销售团队管理,团队管理系统,员工考勤管理系统,免费财务软件,企业财务管理软件,财务软件有哪些,oa办公自动化系统'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          '湛江市三帆外勤软件有限公司致力于移动互联网各个领域手机应用开发、客户端开发、服务端开发、手机软件开发方向；创建团队都是来自行业内的经营成员，拥有丰富的无线及互联网工作经验；我们专注于移动互联网，坚持以技术创新为核心，以用户需求为导向，关注用户体验，市场发展方向，努力成为国内领先的移动互联网应用开发服务商，为企业客户提供最专业的移动应用产品的开发支持和解决方案。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    // 项目里要使用的 SCSS 文件
    '@/assets/scss/main.scss',
    '@/assets/scss/bulma.scss',
    // element css
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/baidu', ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],

    /*
    ** You can extend webpack config here
    */

    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/',
        redirect: '/'
      })
    }
  }
}
