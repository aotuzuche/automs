const fs = require('fs-extra')
const os = require('os')
const paths = require('../libs/paths')

// 修改项目package.json
const fixPackageJson = async () => {
  if (!fs.existsSync(paths.appPackageJson)) {
    throw new Error('缺少 package.json 文件')
  }

  const pkg = JSON.parse(fs.readFileSync(paths.appPackageJson))

  if (!pkg) {
    throw new Error('package.json 文件内容不能为空')
  }

  if (!pkg.scripts) {
    pkg.scripts = {}
  }

  pkg.scripts.doctor = 'automs doctor'

  pkg.browserslist = {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
  }

  fs.writeFileSync(paths.appPackageJson, JSON.stringify(pkg, null, 2) + os.EOL)
}

module.exports = fixPackageJson
