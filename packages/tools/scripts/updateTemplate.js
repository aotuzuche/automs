const path = require('path')
const fs = require('fs')
const paths = require('../libs/paths')
const logger = require('../libs/logger')

// 更新模板文件
const updateTemplate = async () => {
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
    require.resolve('@automs/template').replace(/index\.js$/, ''),
    'init',
    replaceDot ? name.replace(/\./g, '_dot_') : name,
  )

  const file = path.resolve(paths.appPath, name)
  const fileExist = fs.existsSync(file)

  if (!fs.existsSync(template)) {
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
