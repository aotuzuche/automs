const publicPayload = require('../../tools/scripts/publicPayload')
const uploadOss = require('../../tools/scripts/uploadOss')

const main = async args => {
  try {
    await publicPayload()
    await uploadOss(args[0])
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
