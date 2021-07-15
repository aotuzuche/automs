const spawn = require('cross-spawn')
const path = require('path')
const fs = require('fs')
const paths = require('../libs/paths')
const packageVersion = require('../libs/packageVersion')
const logger = require('../libs/logger')

// 更新模板文件
const updateTemplate = async () => {
  const temp = await packageVersion.compare('@automs/template')
  if (!temp.isSame) {
    const res = spawn.sync('yarn', ['add', '@automs/template', '-D'], {
      stdio: 'inherit',
    })
    if (res.status !== 0) {
      throw res
    }
  }

  // 更新或创建模板文件
  resetFile('.babelrc')
  resetFile('.editorconfig')
  resetFile('.eslintrc.js')
  resetFile('.prettierrc')
  resetFile('.lintstagedrc')
  resetFile('.stylelintrc.json')

  try {
    fs.mkdirSync(path.resolve(paths.appPath, 'bin'))
  } catch (_) {}

  resetFile('bin/test.sh', false)
  resetFile('bin/prod.sh', false)
}

// 更新或创建模板文件
const resetFile = (name, replaceDot = true) => {
  const template = path.resolve(
    paths.template,
    'init',
    replaceDot ? name.replace(/\./g, '_dot_') : name,
  )
  const file = path.resolve(paths.appPath, name)
  const fileExist = fs.existsSync(file)

  if (!fs.existsSync(template) || !fs.existsSync(paths.appSrc)) {
    return
  }

  if (fileExist) {
    const f1 = String(fs.readFileSync(template))
    const f2 = String(fs.readFileSync(file))
    if (f1 !== f2) {
      fs.copyFileSync(template, file)
      logger.succeed(`更新 ${name} 文件`)
    }
  } else {
    fs.copyFileSync(template, file)
    logger.succeed(`创建 ${name} 文件`)
  }
}

module.exports = updateTemplate
