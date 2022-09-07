const { defineConfig } = require('@vue/cli-service')
const url = 'http://192.168.12.37:9999'
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置转发代理
  devServer: {
    // disableHostCheck: true,
    port: 8080,
    proxy: {
      '/': {
        target: url,
        ws: false, // 需要websocket 开启
        pathRewrite: {
          '^/': '/'
        }
      }
      // 3.5 以后不需要再配置
    }
  }
})
