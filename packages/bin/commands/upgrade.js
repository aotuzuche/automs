const checkIsWorkspace = require('../../tools/scripts/checkIsWorkspace')
const updateCli = require('../../tools/scripts/updateCli')

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
