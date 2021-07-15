const checkIsWorkspace = require('../scripts/checkIsWorkspace')
const updateCli = require('../scripts/updateCli')

const main = async () => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    await updateCli()
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
