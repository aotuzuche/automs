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

    process.env.BABEL_ENV = 'production'
    process.env.NODE_ENV = 'production'

    fs.emptyDirSync(paths.appBuild)

    await copyPublicFolder()
    await webpackBuild(args[1])
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
