const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const updateCli = require('@automs/tools/scripts/updateCli')

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
