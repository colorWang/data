'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // 网址标题
const port = 8013 // 端口配置
const apiHost = '193.169.100.147:8087'
const apiSevice = 'http://' + apiHost

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/itms': {
        target: apiSevice,
        changeOrigin: false,
        pathRewrite: {
          '^/itms': 'itms'
        },
        cookiePathRewrite: {
          '*': '/'
        },
        onProxyReq: function(proxyReq, req) {
          // 将本地请求的头信息复制一遍给代理。
          // 包含cookie信息，这样就能用登录后的cookie请求相关资源
          Object.keys(req.headers).forEach(key =>
            proxyReq.setHeader(key, req.headers[key])
          )
          // 代理的host 设置成被代理服务的，解决跨域访问
          proxyReq.setHeader('Host', apiHost)
          proxyReq.setHeader('Access-Control-Allow-Origin', 'true')
        },
        onProxyRes: function(proxyRes, req, res) {
          // 将服务器返回的头信息，复制一遍给本地请求的响应。
          // 这样就能实现 执行完登录后，本地的返回请求中也有相关cookie，从而实现登录功能代理。
          Object.keys(proxyRes.headers).forEach(key =>
            res.append(key, proxyRes.headers[key])
          )
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: filePath => {
          let iconPath = filePath.replace(/\\/g, '/') // 将\转为/
          iconPath = iconPath.substr(0, iconPath.length - 4) // 去掉末尾的.svg
          const idx = iconPath.indexOf('icons/svg/') // 找到路径的开头
          iconPath = iconPath.substr(idx + 10).replace(/\//g, '-') // 从路径svg下开始截取路径并将/转为-
          return 'icon-' + iconPath // 输出图标的标识名称，前缀icon-已在src\components\SvgIcon\index.vue中定义，不能改变
        }
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
