const inquirer = require('inquirer')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs-extra')
const updateTemplate = require('../scripts/updateTemplate')
const logger = require('../libs/logger')
const ConvertCase = require('../libs/convertCase')
const paths = require('../libs/paths')

const main = async () => {
  try {
    await updateTemplate()

    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'page',
        message: '请输入创建的页面名称 (驼峰)',
        default: 'demo',
        validate: input => {
          if (!/^[a-zA-Z0-9]+$/.test(input)) {
            return `${input} 不符合规范，请重新输入`
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'path',
        message: '在src/pages下的子目录名 (1.驼峰 2.不需要的话留空)',
        validate: input => {
          if (input === '') {
            return true
          }
          if (!/^[a-zA-Z0-9]+$/.test(input)) {
            return `${input} 不符合规范，请重新输入`
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'route',
        message: '请输入页面路由',
        default: '/demo',
      },
      {
        type: 'confirm',
        name: 'auth',
        message: '是否需要用户登录',
      },
      {
        type: 'confirm',
        name: 'model',
        message: '是否需要model (dva)',
      },
      {
        type: 'input',
        name: 'namespace',
        when: answers => answers.model,
        message: '请输入model的namespace',
        validate: input => {
          if (input === '') {
            return '请输入model的namespace'
          }
          return true
        },
      },
    ])

    res.pascalPage = ConvertCase.pascalize(res.path ? `${res.path}_${res.page}` : res.page)
    res.className = 'page-'
    res.className += res.path ? `${ConvertCase.dashfy(res.path)}-` : ''
    res.className += ConvertCase.dashfy(res.page)

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
  const f = path.resolve(paths.template, 'templates/create_page', p)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    let temp = ejs.render(str, data)
    temp = temp.trim().replace(/(\r?\n){2,}/g, '\n\n')
    fs.writeFileSync(path.resolve(paths.appSrc, 'pages', name), temp)
    logger.succeed('创建' + name)
  }
}

module.exports = main(process.argv.slice(2))
