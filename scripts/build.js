const webpack = require('webpack')
const fs = require('fs-extra')
const webpackConfig = require('../webpack/config')
const logger = require('../libs/logger')
const paths = require('../libs/paths')

const main = async () => {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'

  process.on('unhandledRejection', err => {
    throw err
  })

  build()
    .then(res => {
      console.log('')
      logger.succeed(res)
      console.log('')
    })
    .catch(() => {
      fs.remove(paths.appBuild)
    })
}

const build = () => {
  return new Promise((resolve, reject) => {
    const config = webpackConfig('production')
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors() && stats.toJson().errorsCount) {
        return reject(stats.toJson().errors[0])
      }

      resolve(stats.toString({ chunks: false, colors: true }))
    })
  })
}

module.exports = main(process.argv.slice(2))
