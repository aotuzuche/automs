#!/usr/bin/env node

const spawn = require('../libs/spawn')
const env = require('../libs/dotenv')
const packageVersion = require('../libs/packageVersion')
const checkCliVersion = require('../scripts/checkCliVersion')

// console.log(process.versions.node)

const commands = [
  { name: 'init', alias: '-i', desc: '创建项目' },
  { name: 'create', alias: '-c', desc: '创建页面，最多支持二级页面' },
  { name: 'start', alias: '-s', desc: '进行本地开发' },
  { name: 'build', desc: '进行正式环境的打包' },
  { name: 'build', extra: 'test', desc: '行测试环境的打包' },
  { name: 'deploy', desc: '进行正式环境的打包与部署(部署包含打包环节)' },
  { name: 'deploy', extra: 'test', desc: '进行测试环境的打包与部署(部署包含打包环节)' },
  { name: 'doctor', desc: '检查项目依赖、配置、lint等情况' },
  { name: 'upgrade', desc: '升级脚手架，同时将项目依赖升级至最新' },
  { name: 'version', alias: '-v', desc: '查看当前脚手架版本' },
  { name: 'help', alias: '-h', desc: '看帮助文档' },
]

const main = async args => {
  const command = getCommand(args)

  if (!command) {
    console.log('未知命令，请使用 automs help 查看帮助文档')
    return
  }

  if (command.name === 'help') {
    printHelp()
    return
  }

  if (command.name === 'version') {
    const v = packageVersion.local('automs')
    console.log(v)
    return
  }

  // start、build、depoly时注入环境变量
  if (command.name === 'start') {
    env.inject('dev')
  } else if ((command.name === 'build' || command.name === 'deploy') && command.extra === 'test') {
    env.inject('test')
  }

  // check automs last version
  await checkCliVersion()

  // 执行脚本
  const result = spawn.bin(command.name, command.extra)

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.',
      )
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.',
      )
    }
    process.exit(1)
  }

  process.exit(result.status)
}

const getCommand = args => {
  const script = args[0]
  if (!script) {
    return
  }

  const name = script.split(':')[0]
  const extra = script.split(':')[1]

  if (!name) {
    return
  }

  return commands.find(c => {
    return (c.name === name || c.alias === name) && c.extra === extra
  })
}

const printHelp = () => {
  console.log('可用命令：')
  commands.forEach(c => {
    const name = `${c.name}${c.extra ? `:${c.extra}` : ''}${c.alias ? `, ${c.alias}` : ''}`
    console.log(`  ${`${name}${' '.repeat(20)}`.substr(0, 22)}${c.desc}`)
  })
}

module.exports = main(process.argv.slice(2))
