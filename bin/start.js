const webpackDevServer = require('../scripts/webpackDevServer')

const main = async () => {
  try {
    await webpackDevServer()
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))