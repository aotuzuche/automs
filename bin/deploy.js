const publicPayload = require('../scripts/publicPayload')
const uploadOss = require('../scripts/uploadOss')

const main = async args => {
  try {
    await publicPayload()
    await uploadOss(args[0])
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
