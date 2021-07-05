const spawn = require('../libs/spawn')

const main = args => {
  // if (spawn.scripts('webpackBuild', args).status !== 0) return
  if (spawn.scripts('publicPayload', args).status !== 0) return
  if (spawn.scripts('uploadOss', args).status !== 0) return
}

module.exports = main(process.argv.slice(2))
