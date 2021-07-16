const ejs = require('ejs')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const updateTemplate = require('@automs/tools/scripts/updateTemplate')
const askCreateQuestions = require('@automs/tools/scripts/askCreateQuestions')
const checkIsWorkspace = require('@automs/tools/scripts/checkIsWorkspace')
const logger = require('@automs/tools/libs/logger')
const paths = require('@automs/tools/libs/paths')
const template = require('@automs/template')

const main = async () => {
  try {
    // 检查当前环境
    if (!checkIsWorkspace()) {
      return
    }

    // 更新模板
    template()
    await updateTemplate()

    // 提问
    const res = await askCreateQuestions()

    // 创建pages目录
    try {
      fs.mkdirSync(path.resolve(paths.appSrc, 'pages'))
    } catch (_) {}

    // 如果有path, 创建目录
    if (res.path) {
      try {
        fs.mkdirSync(path.resolve(paths.appSrc, 'pages', res.path))
      } catch (_) {}
    }

    // 判断和创建页面目录
    const ph = path.resolve(paths.appSrc, 'pages', res.path, res.page)
    if (fs.existsSync(ph)) {
      throw new Error('创建失败，目录已存在')
    } else {
      fs.mkdirSync(ph)
    }

    console.log('')
    createFile('index.temp', res, path.join(res.path, res.page, 'index.ts'))
    createFile('service.temp', res, path.join(res.path, res.page, 'service.ts'))
    createFile('view.temp', res, path.join(res.path, res.page, 'view.tsx'))
    createFile('style.temp', res, path.join(res.path, res.page, 'style.scss'))
    createFile('controller.temp', res, path.join(res.path, res.page, 'controller.ts'))
    createFile('page.temp', res, path.join(res.path, res.page, '.page'))
    if (res.model) {
      createFile('model.temp', res, path.join(res.path, res.page, 'model.ts'))
    }

    logger.succeed('创建完成')
  } catch (err) {
    logger.errorWithExit(err.message)
  }
}

const createFile = (p, data, name) => {
  const f = path.resolve(paths.template, 'create_page', p)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    let temp = ejs.render(str, data)
    temp = temp.trim().replace(/(\r?\n){2,}/g, '\n\n') + os.EOL
    fs.writeFileSync(path.resolve(paths.appSrc, 'pages', name), temp)
    logger.succeed('创建' + name)
  }
}

module.exports = main(process.argv.slice(2))
