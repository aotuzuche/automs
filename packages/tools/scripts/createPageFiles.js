const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const os = require('os')
const paths = require('../libs/paths')
const logger = require('../libs/logger')

/**
 * data
 * page: 页面名称，驼峰
 * path: 子目录，可为空
 * route: 路由
 * auth: bool 是否需要用户登录授权
 * model: bool 是否需要model层
 * namespace: model的namespace
 * pascalPage: 大驼峰页面名称, 用于page的interface名称
 * className: 页面样式名
 */
const createPageFiles = data => {
  // 创建pages目录
  try {
    fs.mkdirSync(path.resolve(paths.appSrc, 'pages'))
  } catch (_) {}

  // 如果有path, 创建目录
  if (data.path) {
    try {
      fs.mkdirSync(path.resolve(paths.appSrc, 'pages', data.path))
    } catch (_) {}
  }

  // 判断和创建页面目录
  const ph = path.resolve(paths.appSrc, 'pages', data.path, data.page)
  if (fs.existsSync(ph)) {
    throw new Error('创建失败，目录已存在')
  } else {
    fs.mkdirSync(ph)
  }

  console.log('')
  createFile('index.temp', data, path.join(data.path, data.page, 'index.ts'))
  createFile('service.temp', data, path.join(data.path, data.page, 'service.ts'))
  createFile('view.temp', data, path.join(data.path, data.page, 'view.tsx'))
  createFile('style.temp', data, path.join(data.path, data.page, 'style.scss'))
  createFile('controller.temp', data, path.join(data.path, data.page, 'controller.ts'))
  createFile('page.temp', data, path.join(data.path, data.page, '.page'))
  if (data.model) {
    createFile('model.temp', data, path.join(data.path, data.page, 'model.ts'))
  }
}

const createFile = (p, data, name) => {
  const template = path.resolve(require.resolve('@automs/template').replace(/index\.js$/, ''))
  const f = path.resolve(template, 'create_page', p)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    let temp = ejs.render(str, data)
    temp = temp.trim().replace(/(\r?\n){2,}/g, '\n\n') + os.EOL
    fs.writeFileSync(path.resolve(paths.appSrc, 'pages', name), temp)
    logger.succeed('创建' + name)
  }
}

module.exports = createPageFiles
