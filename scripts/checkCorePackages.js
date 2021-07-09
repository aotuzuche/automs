const packageVersion = require('../libs/packageVersion')
const spawn = require('cross-spawn')

// 检查核心包版本
const main = async () => {
  // 检查并更新模板包
  const temp = await packageVersion.compare('@automs/template')
  if (!temp.isSame) {
    spawn.sync('yarn', ['add', '@automs/template', '-D'], {
      stdio: 'inherit',
    })
  }
}

module.exports = main(process.argv.slice(2))
