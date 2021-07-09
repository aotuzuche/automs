#!/usr/bin/env node

const spawn = require('../libs/spawn')
const env = require('../libs/dotenv')

const main = args => {
  let script = args[0]
  let props = args.slice(1)

  const scriptMap = {
    '-h': 'help',
    '--help': 'help',
    '-v': '--version',
  }

  // 简化命令
  if (scriptMap[script]) {
    script = scriptMap[script]
  }

  // 打印版本
  if (script === '--version') {
    script = 'help'
    props = ['-v']
  }

  // 匹配命令
  if (!['build', 'start', 'deploy', 'doctor'].includes(script)) {
    script = 'help'
  }

  // start、build、depoly时注入环境变量
  if (script === 'start') {
    env.inject('dev')
  } else if ((script === 'build' || script === 'deploy') && props[1] === 'test') {
    env.inject('test')
  }

  // check automs last version
  if (script !== 'help') {
    spawn.scripts('checkCliVersion')
  }

  // 执行脚本
  const result = spawn.bin(script, props)

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

module.exports = main(process.argv.slice(2))
