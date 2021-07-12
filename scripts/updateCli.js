const inquirer = require('inquirer')
const spawn = require('cross-spawn')
const packageVersion = require('../libs/packageVersion')

// 更新脚手架
const updateCli = async () => {
  const cli = await packageVersion.compare('automs')
  if (!cli.isSame) {
    const p = await inquirer.prompt({
      type: 'confirm',
      name: 'reslut',
      message: `发现新版本${cli.last}，确定升级吗？`,
    })

    if (!p.reslut) {
      throw new Error('停止升级')
    }

    const res = spawn.sync('yarn', ['add', 'automs', '-D'], {
      stdio: 'inherit',
    })

    if (res.status !== 0) {
      throw res
    }
  }
}

module.exports = updateCli
