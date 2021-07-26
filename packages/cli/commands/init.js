const path = require('path')
const fs = require('fs-extra')
const logger = require('@automs/tools/libs/logger')
const askInitQuestions = require('@automs/tools/scripts/askInitQuestions')
const generateProject = require('@automs/tools/scripts/generateProject')

const main = async () => {
  try {
    const res = await askInitQuestions()

    const projectPath = path.resolve(process.cwd(), res.name)

    if (fs.existsSync(projectPath)) {
      logger.errorWithExit('该目录已存在')
      return
    }

    // 创建项目目录
    fs.mkdirSync(projectPath)

    console.log('')
    logger.spin('项目创建中...')
    await generateProject(projectPath)
    logger.succeed('创建完成')
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
