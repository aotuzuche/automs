const fs = require('fs-extra')
const logger = require('@automs/tools/libs/logger')
const paths = require('@automs/tools/libs/paths')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const copyPublicFolder = require('@automs/tools/scripts/copyPublicFolder')
const webpackBuild = require('@automs/webpack/build')

const main = async args => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    fs.emptyDirSync(paths.appBuild)

    await copyPublicFolder()
    await webpackBuild(args[0] === 'test' ? 'test' : 'prod')
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
