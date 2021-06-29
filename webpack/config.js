const paths = require('../libs/paths')

const webpackConfig = mode => {
  const isEnvDevelopment = mode === 'development'
  const isEnvProduction = mode === 'production'

  const config = {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

    // 在第一个错误出现时抛出失败结果，而不是容忍它
    bail: isEnvProduction,

    // source-map
    devtool: isEnvProduction ? false : isEnvDevelopment ? 'cheap-module-source-map' : false,

    // 入口文件
    entry: paths.appIndexJs,

    // 出口文件
    output: {
      path: isEnvProduction ? paths.appBuild : void 0,
      pathinfo: isEnvDevelopment,
    },

    plugins: [],
  }

  return config
}

module.exports = webpackConfig
