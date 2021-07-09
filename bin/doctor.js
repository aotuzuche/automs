const spawn = require('../libs/spawn')

const main = args => {
  if (spawn.scripts('addPackageScripts', args).status !== 0) return
}

module.exports = main(process.argv.slice(2))
