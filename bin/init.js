const askInitQuestions = require('../scripts/askInitQuestions')

const main = async () => {
  const res = await askInitQuestions()

  console.log(res)
}

module.exports = main(process.argv.slice(2))
