const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false,
    },
  },
  // proxy: {
  //   [`/api/cwapi/`]: {
  //     target: 'http://test-gxf.jd.com',
  //     ws: false,
  //     pathRewrite: {
  //       [`/api/cwapi/`]: '' // 需要rewrite的,
  //     },
  //     changeOrigin: true,
  //     logLevel: 'debug'
  //   },
  //   [`${process.env.VUE_APP_API_BASE_PATH}/`]: {
  //     target: require('minimist')(process.argv.slice(3))?.requestUrl || process.env.VUE_APP_API_BASE_URL,
  //     ws: false,
  //     changeOrigin: true,
  //     // pathRewrite: {
  //     //   [`^${process.env.VUE_APP_API_BASE_PATH}`]: '' // 需要rewrite的,
  //     // },
  //     logLevel: 'debug'
  //   }
  // }
})
