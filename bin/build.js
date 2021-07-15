const webpackBuild = require('@automs/webpack/build')

const main = async args => {
  try {
    await webpackBuild(args[1])
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
