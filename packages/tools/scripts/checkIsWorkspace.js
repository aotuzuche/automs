const fs = require('fs')
const paths = require('../libs/paths')

const checkIsWorkspace = () => {
  if (!fs.existsSync(paths.appPackageJson)) {
    throw new Error('当前目录中没有 package.json ，请确认环境')
  }

  if (!fs.existsSync(paths.appSrc)) {
    throw new Error('当前目录中没有 src 目录 ，请确认环境')
  }

  return true
}

module.exports = checkIsWorkspace
