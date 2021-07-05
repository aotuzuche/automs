const spawn = require('../libs/spawn')

const main = args => {
  return spawn.scripts('webpackBuild', args)
}

module.exports = main(process.argv.slice(2))
