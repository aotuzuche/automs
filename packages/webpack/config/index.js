const path = require('path')
const { merge } = require('webpack-merge')
const paths = require('@automs/tools/libs/paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackConfig = mode => {
  const isProd = mode === 'prod'

  const config = require('react-scripts/config/webpack.config')(
    isProd ? 'production' : 'development',
  )

  // 修改插件配置
  config.plugins.forEach(p => {
    if (p instanceof HtmlWebpackPlugin && p.options) {
      p.options.template =
        process.env.REACT_APP_PACKAGE === 'prod' ? paths.appProdHtml : paths.appDevHtml
      // 为了保留卡槽，所以注释保留
      p.options.minify.removeComments = false
    } else if (p instanceof MiniCssExtractPlugin && p.options) {
      p.options.filename = 'css/[name].[contenthash:8].css'
      p.options.chunkFilename = 'css/[name].[contenthash:8].chunk.css'
    }
  })

  // 修改loader
  if (config.module.rules) {
    config.module.rules.forEach(r => {
      if (!r.oneOf) {
        return
      }

      r.oneOf.forEach(r => {
        if (r.loader && r.loader.includes('url-loader')) {
          r.options.name = 'media/[name].[hash:8].[ext]'
        } else if (r.loader && r.loader.includes('file-loader')) {
          r.options.name = 'media/[name].[hash:8].[ext]'
        } else if (r.test && r.test instanceof RegExp) {
          const isStyleLoader =
            r.test.test('.css') ||
            r.test.test('.module.css') ||
            r.test.test('.scss') ||
            r.test.test('.module.scss')

          if (process.env.PX_TO_REM !== 'false' && isStyleLoader && r.use) {
            const index = r.use.findIndex(u => u.loader && u.loader.includes('css-loader'))
            if (index !== -1) {
              const remUnit = process.env.REM_UNIT
              r.use.splice(index + 1, 0, {
                loader: require.resolve('./px2rem-loader/index.js'),
                options: {
                  remUnit: remUnit && parseInt(remUnit, 10) > 0 ? parseInt(remUnit, 10) : 100,
                  remPrecision: 8,
                  include: [path.join('node_modules', 'auto-ui')],
                },
              })
            }
          }

          if (isStyleLoader && r.use) {
            r.use.push({
              loader: require.resolve('dmvars-loader'),
            })
          }

          // 使用.babelrc文件
          if (r.test.test('.tsx') && r.loader && r.loader.includes('babel-loader')) {
            r.options.babelrc = true
          }
        }
      })
    })
  }

  const mergedConfig = merge(config, {
    output: {
      filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/bundle.js',
      chunkFilename: isProd ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
      path: isProd ? paths.appBuild : void 0,
      publicPath: isProd ? paths.publicPath : '/',
    },
    plugins: [
      // 之后如要接入sentry的话需要该loader，否则sentry那边拿不到代码报错位置信息
      // new HtmlWebpackTransformPlugin({
      //   attributes: { script: { crossorigin: 'anonymous' } },
      // }),
    ],
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

  return mergedConfig
}

module.exports = webpackConfig
