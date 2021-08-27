const fs = require('fs-extra')
const path = require('path')
const os = require('os')

const generateProject = projectPath => {
  const pkg = {
    name: 'yarn-example',
    version: '1.0.0',
    main: 'index.js',
    license: 'MIT',
  }

  const packageJson = path.resolve(projectPath, 'package.json')
  fs.writeFileSync(packageJson, JSON.stringify(pkg, null, 2) + os.EOL)

  const template = path.resolve(require.resolve('@automs/template'), '..')
  const initTemplate = path.resolve(template, 'init')

  console.log(process.cwd())
  console.log(__dirname)
  console.log(initTemplate)

  // const res = spawn.sync('yarn', ['add', '@automs/template', '-D'], {
  //   stdio: 'inherit',
  // })

  // if (res.status !== 0) {
  //   console.log(res)
  //   throw res
  // }
}

module.exports = generateProject
