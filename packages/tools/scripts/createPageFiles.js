const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const os = require('os')
const logger = require('../libs/logger')
const paths = require('../libs/paths')

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
const createPageFiles = (data, basePath = '') => {
  const src = getSrcPath(basePath)

  // 创建pages目录
  try {
    fs.mkdirSync(path.resolve(src, 'pages'))
  } catch (_) {}

  // 如果有path, 创建目录
  if (data.path) {
    try {
      fs.mkdirSync(path.resolve(src, 'pages', data.path))
    } catch (_) {}
  }

  // 判断和创建页面目录
  const ph = path.resolve(src, 'pages', data.path, data.page)
  if (fs.existsSync(ph)) {
    if (data.cover) {
      fs.removeSync(ph)
      fs.mkdirSync(ph)
    } else {
      throw new Error('创建失败，目录已存在')
    }
  } else {
    fs.mkdirSync(ph)
  }

  createFile('index.temp', data, path.join(data.path, data.page, 'index.ts'), src)
  createFile('service.temp', data, path.join(data.path, data.page, 'service.ts'), src)
  createFile('view.temp', data, path.join(data.path, data.page, 'view.tsx'), src)
  createFile('style.temp', data, path.join(data.path, data.page, 'style.scss'), src)
  createFile('controller.temp', data, path.join(data.path, data.page, 'controller.ts'), src)
  createFile('page.temp', data, path.join(data.path, data.page, '.page'), src)
  if (data.model) {
    createFile('model.temp', data, path.join(data.path, data.page, 'model.ts'), src)
  }
}

const getSrcPath = basePath => {
  if (!basePath) {
    return paths.appSrc
  }

  return path.resolve(basePath, 'src')
}

const createFile = (p, data, name, src) => {
  const template = path.resolve(require.resolve('@automs/template'), '..')
  const f = path.resolve(template, 'create_page', p)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    let temp = ejs.render(str, data)
    temp = temp.trim().replace(/(\r?\n){2,}/g, '\n\n') + os.EOL
    fs.writeFileSync(path.resolve(src, 'pages', name), temp)
    logger.succeed('创建 src/pages/' + name)
  }
}

module.exports = createPageFiles
