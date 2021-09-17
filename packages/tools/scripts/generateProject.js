const path = require('path')
const fs = require('fs-extra')
const logger = require('../libs/logger')

const generateProject = projectPath => {
  console.log('')
  createFile('package.json', projectPath)
  createFile('tsconfig.json', projectPath)
  createFile('README.md', projectPath)
  createFile('_dot_babelrc', '.babelrc', projectPath)
  createFile('_dot_editorconfig', '.editorconfig', projectPath)
  createFile('_dot_env', '.env', projectPath)
  createFile('_dot_eslintrc_dot_js', '.eslintrc.js', projectPath)
  createFile('_dot_gitignore', '.gitignore', projectPath)
  createFile('_dot_lintstagedrc', '.lintstagedrc', projectPath)
  createFile('_dot_prettierrc', '.prettierrc', projectPath)
  createFile('_dot_stylelintrc_dot_json', '.stylelintrc.json', projectPath)

  createFolder('bin', projectPath)
  createFile('bin/dev.sh', projectPath)
  createFile('bin/prod.sh', projectPath)
  createFile('bin/test.sh', projectPath)

  createFolder('public', projectPath)
  createFile('public/favicon.ico', projectPath)
  createFile('public/index.dev.html', projectPath)
  createFile('public/index.prod.html', projectPath)

  createFolder('src', projectPath)
  createFolder('src/pages', projectPath)
  createFolder('src/pages/home', projectPath)
  createFile('src/index.tsx', projectPath)
}

const createFolder = (folder, p) => {
  fs.mkdirSync(path.resolve(p, folder))
}

const createFile = (source, target, p) => {
  const _target = p ? target : source
  const _p = p ? p : target

  const template = path.resolve(require.resolve('@automs/template'), '..')
  const f = path.resolve(template, 'init', source)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    fs.writeFileSync(path.resolve(_p, _target), str)
    logger.succeed('创建 ' + _target)
  }
}

module.exports = generateProject
