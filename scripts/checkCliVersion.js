const chalk = require('chalk')
const packageVersion = require('../libs/packageVersion')

// 检查automs版本
const checkCliVersion = async () => {
  const tips = chalk.greenBright(`
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║ A new version of automs is available!                                      ║
  ║                                                                            ║
  ║ To update to the latest version, run "automs upgrade".                     ║
  ╚════════════════════════════════════════════════════════════════════════════╝
`)

  // 本地没有安装时不检测
  const local = packageVersion.local('automs')
  if (!local) {
    return
  }

  // 对比本地与线上版本
  const res = await packageVersion.compare('automs')
  if (!res.isSame) {
    console.log(tips)
    await new Promise(resolve => {
      setTimeout(resolve, 2000)
    })
  }
}

module.exports = checkCliVersion
