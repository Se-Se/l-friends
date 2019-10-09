const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  publicPath: 'm', // 基本路径
  outputDir: 'dist/m',
  devServer: {
    port: 8082,
    disableHostCheck: true
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false
      config.plugins.push(
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'public/index.html',
          inject: true,
          hash: true
        })
      )
      // config.plugins.push(
      //   new BundleAnalyzerPlugin()
      // )
    }
  }
}
