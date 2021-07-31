const webpack = require('webpack')
const fs = require('fs-extra')
const logger = require('@automs/tools/libs/logger')
const paths = require('@automs/tools/libs/paths')
const formatWebpackMessages = require('@automs/tools/libs/formatWebpackMessages')
const checkRequiredFiles = require('@automs/tools/libs/checkRequiredFiles')
const webpackConfig = require('./config')

const webpackBuild = async (mode = 'prod') => {
  if (
    !checkRequiredFiles([mode === 'prod' ? paths.appProdHtml : paths.appDevHtml, paths.appIndexJs])
  ) {
    throw new Error('缺少打包需要的入口文件')
  }

  process.on('unhandledRejection', err => {
    throw err
  })

  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'

  // 开始打包
  build(mode)
    .then(res => {
      console.log('')
      logger.succeed(res || '打包完成')
      console.log('')
    })
    .catch(err => {
      if (err && err.message) {
        fs.remove(paths.appBuild)
        logger.errorWithExit(err.message)
      }
    })
}

const build = mode => {
  const writeStatsJson = false
  const config = webpackConfig(mode)
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages
      if (err) {
        if (!err.message) {
          return reject(err)
        }

        let errMessage = err.message

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage += '\nCompileError: Begins at CSS selector ' + err['postcssNode'].selector
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        })
      } else {
        messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }))
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(
          w => !/Failed to parse source map/.test(w),
        )
        if (filteredWarnings.length) {
          logger.err(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n',
          )
          return reject(new Error(filteredWarnings.join('\n\n')))
        }
      }

      const resolveArgs = {
        stats,
        previousFileSizes: {},
        warnings: messages.warnings,
      }

      if (writeStatsJson) {
        // return bfj
        //   .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
        //   .then(() => resolve(resolveArgs))
        //   .catch(error => reject(new Error(error)))
      }

      return resolve(resolveArgs)
    })
  })
}

module.exports = webpackBuild
