const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const paths = require('../libs/paths')
const logger = require('../libs/logger')

const generateProject = projectPath => {
  const pkg = {
    name: 'yarn-example',
    version: '1.0.0',
    main: 'index.js',
    license: 'MIT',
  }

  const packageJson = path.resolve(projectPath, 'package.json')
  fs.writeFileSync(packageJson, JSON.stringify(pkg, null, 2) + os.EOL)

  console.log('')
  createFile('_dot_babelrc', '.babelrc')
  createFile('_dot_editorconfig', '.editorconfig')
  createFile('_dot_env', '.env')
  createFile('_dot_eslintrc_dot_js', '.eslintrc.js')
  createFile('_dot_gitignore', '.gitignore')
  createFile('_dot_lintstagedrc', '.lintstagedrc')
  createFile('_dot_prettierrc', '.prettierrc')
  createFile('_dot_stylelintrc_dot_json', '.stylelintrc.json')
}

const createFile = (source, target) => {
  const template = path.resolve(require.resolve('@automs/template'), '..')
  const f = path.resolve(template, 'init', source)

  if (fs.existsSync(f)) {
    const str = String(fs.readFileSync(f))
    fs.writeFileSync(path.resolve(paths.appPath, target), str)
    logger.succeed('创建' + target)
  }
}

module.exports = generateProject
