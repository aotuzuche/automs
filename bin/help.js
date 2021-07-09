const packageVersion = require('../libs/packageVersion')

const main = async args => {
  if (args[0] === '-v') {
    const res = await packageVersion.compare('automs')
    let text = `当前版本为[${res.local}]`
    if (res.isSame) {
      text += '，已经是最新版本'
    } else {
      text += `，最新版本为[${res.last}]，使用 automs upgrade 更新`
    }
    console.log(text)
    return
  }

  const text = `
可用命令：
  init <project>        创建项目
  create <newpage>      创建页面，最多支持二级页面，即：automs create users/user
  start                 进行本地开发
  build                 进行正式环境的打包
  build:test            进行测试环境的打包
  deploy                进行正式环境的打包与部署(部署包含打包环节)
  deploy:test           进行测试环境的打包与部署(部署包含打包环节)
  upgrade               升级脚手架，同时将项目依赖升级至最新

其他功能：
  -v, --version         查看当前脚手架版本
  -h, --help            查看帮助文档，此外其他未知命令也返回该文档
  `

  console.log(text.trim())
}

module.exports = main(process.argv.slice(2))
