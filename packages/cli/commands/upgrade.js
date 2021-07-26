const logger = require('@automs/tools/libs/logger')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const updateCli = require('@automs/tools/scripts/updateCli')

const main = async () => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    await updateCli()
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
