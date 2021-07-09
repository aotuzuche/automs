const logger = require('../libs/logger')
const spawn = require('../libs/spawn')

const main = args => {
  if (spawn.scripts('addPackageScripts', args).status !== 0) return
  if (spawn.scripts('updateTemplate', args).status !== 0) return
  if (spawn.scripts('updatePackages', args).status !== 0) return
  logger.succeed('检查完成')
}

module.exports = main(process.argv.slice(2))
