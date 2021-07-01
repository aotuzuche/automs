const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../webpack/config')

const main = async () => {
  process.env.BABEL_ENV = 'development'
  process.env.NODE_ENV = 'development'

  process.on('unhandledRejection', err => {
    throw err
  })

  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
  const HOST = process.env.HOST || '0.0.0.0'

  const config = webpackConfig('development')
  const compiler = webpack(config)
  const devServer = new WebpackDevServer(config, compiler)

  devServer.listen(DEFAULT_PORT, HOST, err => {
    console.log(err)
    console.log('Starting server on http://localhost:8080')
  })
}

module.exports = main(process.argv.slice(2))
