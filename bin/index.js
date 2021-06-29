const spawn = require('cross-spawn')
const logger = require('../libs/logger')
const path = require('path')
require('../libs/dotenv')

const main = args => {
  const script = args[0]

  if (!['build', 'start'].includes(script)) {
    logger.errorWithExit(`Unknow script '${script}'`)
    return
  }

  const result = spawn.sync(
    process.execPath,
    [path.resolve('..', 'scripts', script), args.slice(1)],
    { stdio: 'inherit' },
  )

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
