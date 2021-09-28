const path = require('path')
const fs = require('fs-extra')
const logger = require('@automs/tools/libs/logger')
const askInitQuestions = require('@automs/tools/scripts/askInitQuestions')
const generateProject = require('@automs/tools/scripts/generateProject')
const askReplaceQuestions = require('@automs/tools/scripts/askReplaceQuestions')
const createPageFiles = require('@automs/tools/scripts/createPageFiles')

const main = async () => {
  try {
    const res = await askInitQuestions()

    const projectPath = path.resolve(process.cwd(), res.name)

    if (fs.existsSync(projectPath)) {
      const ok = await askReplaceQuestions()
      if (!ok) {
        return
      }
      logger.spin('清空目录...')
      logger.succeed()
      fs.removeSync(projectPath)
    }

    // 创建项目目录
    fs.mkdirSync(projectPath)

    console.log('')
    logger.spin('项目创建中...')

    await generateProject(projectPath)

    await createPageFiles(
      {
        page: 'home',
        path: '',
        route: '/',
        auth: false,
        model: false,
        pascalPage: 'Home',
        className: 'page-home',
        cover: true,
      },
      projectPath,
    )

    logger.succeed('创建完成')
    console.log('')
    console.log(`  cd ${res.name}`)
    console.log('  yarn && yarn start')
    console.log('')
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

module.exports = main(process.argv.slice(2))
