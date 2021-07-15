const path = require('path')
const fs = require('fs-extra')
const logger = require('../libs/logger')
const askInitQuestions = require('../scripts/askInitQuestions')
const generateProject = require('../scripts/generateProject')

const main = async () => {
  const res = await askInitQuestions()

  const projectPath = path.resolve(process.cwd(), res.name)

  if (fs.existsSync(projectPath)) {
    logger.errorWithExit('该目录已存在')
    return
  }

  // 创建项目目录
  fs.mkdirSync(projectPath)

  try {
    console.log('')
    logger.spin('项目创建中...')
    await generateProject(projectPath)
    logger.succeed('创建完成')
  } catch (err) {
    logger.error(err.message)
  }
}

module.exports = main(process.argv.slice(2))
