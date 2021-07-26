const path = require('path')
const { merge } = require('webpack-merge')
const paths = require('@automs/tools/libs/paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = mode => {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'
  process.env.REACT_APP_PACKAGE = mode === 'prod' ? 'prod' : 'dev'

  const config = require('react-scripts/config/webpack.config')('production')

  config.plugins.forEach(p => {
    if (p instanceof HtmlWebpackPlugin) {
      console.log(p)
    }
  })

  return merge(config, {
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css'],

      alias: {
        '@/components': path.join(paths.appSrc, 'components'),
        '@/containers': path.join(paths.appSrc, 'containers'),
        '@/utils': path.join(paths.appSrc, 'utils'),
        '@/libs': path.join(paths.appSrc, 'libs'),
        '@/assets': path.join(paths.appSrc, 'assets'),
        '@/conf': path.join(paths.appSrc, 'conf'),
        '@/hooks': path.join(paths.appSrc, 'hooks'),
      },
    },
  })
}

module.exports = webpackConfig
