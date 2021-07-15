const fs = require('fs')
const logger = require('../libs/logger')
const paths = require('../libs/paths')

const checkIsWorkspace = () => {
  if (!fs.existsSync(paths.appPackageJson)) {
    logger.errorWithExit('当前目录中没有 package.json ，请确认环境')
    return false
  }

  if (!fs.existsSync(paths.appSrc)) {
    logger.errorWithExit('当前目录中没有 src 目录 ，请确认环境')
    return false
  }

  return true
}

module.exports = checkIsWorkspace
