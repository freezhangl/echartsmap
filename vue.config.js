const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false,
    },
    proxy: {
      [`/apiTest/`]: {
        target: 'http://124.222.113.11:3007',
        ws: false,
        pathRewrite: {
          [`/apiTest/`]: '' // 需要rewrite的,
        },
        changeOrigin: true,
        logLevel: 'debug'
      },
      [`/szyw/api/`]: {
        target: 'http://116.198.18.192/',
        ws: false,
        // pathRewrite: {
        //   [`/admin/erp/`]: '/admin/erp/' // 需要rewrite的,
        // },
        changeOrigin: true,
        logLevel: 'debug'
      },
      // [`${process.env.VUE_APP_API_BASE_PATH}/`]: {
      //   target: require('minimist')(process.argv.slice(3))?.requestUrl || process.env.VUE_APP_API_BASE_URL,
      //   ws: false,
      //   changeOrigin: true,
      //   // pathRewrite: {
      //   //   [`^${process.env.VUE_APP_API_BASE_PATH}`]: '' // 需要rewrite的,
      //   // },
      //   logLevel: 'debug'
      // }
    }
  }
})
