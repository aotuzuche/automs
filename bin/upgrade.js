const updateCli = require('../scripts/updateCli')

const main = async () => {
  try {
    await updateCli()
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
