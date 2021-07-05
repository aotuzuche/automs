const logger = require('../libs/logger')
const spawn = require('../libs/spawn')
const env = require('../libs/dotenv')

const main = args => {
  const script = args[0]

  if (!['build', 'start', 'deploy', 'doctor'].includes(script)) {
    logger.errorWithExit(`Unknow script '${script}'`)
    return
  }

  if (script === 'start') {
    env.inject('dev')
  } else if ((script === 'build' || script === 'deploy') && args[1] === 'test') {
    env.inject('test')
  }

  const result = spawn.bin(script, args.slice(1))

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
