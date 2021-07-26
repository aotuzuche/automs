const logger = require('@automs/tools/libs/logger')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const webpackDevServer = require('@automs/webpack/devServer')

const main = async () => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    await webpackDevServer()
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
