const updateCli = require('../scripts/updateCli')

const main = async args => {
  try {
    await updateCli()
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
