const webpackBuild = require('../scripts/webpackBuild')

const main = async args => {
  try {
    await webpackBuild(args[1])
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
