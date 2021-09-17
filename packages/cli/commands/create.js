const logger = require('@automs/tools/libs/logger')
const updateTemplate = require('@automs/tools/scripts/updateTemplate')
const askCreateQuestions = require('@automs/tools/scripts/askCreateQuestions')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const createPageFiles = require('@automs/tools/scripts/createPageFiles')
const template = require('@automs/template')

const main = async () => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    // 更新模板
    template()

    // 提问
    const res = await askCreateQuestions()

    await createPageFiles(res)

    await updateTemplate()

    logger.succeed('创建完成')
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
