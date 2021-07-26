const logger = require('@automs/tools/libs/logger')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const copyPublicFolder = require('@automs/tools/scripts/copyPublicFolder')
const uploadOss = require('@automs/tools/scripts/uploadOss')

const main = async args => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    await copyPublicFolder()
    await uploadOss(args[0])
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
