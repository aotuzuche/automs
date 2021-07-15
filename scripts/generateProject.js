// const spawn = require('cross-spawn')
const fs = require('fs-extra')
const path = require('path')

const generateProject = projectPath => {
  const pkg = {
    name: 'yarn-example',
    version: '1.0.0',
    main: 'index.js',
    license: 'MIT',
  }

  fs.writeJSONSync(path.resolve(projectPath, 'package.json'), pkg)

  console.log(process.cwd())
  console.log(__dirname)

  // const res = spawn.sync('yarn', ['add', '@automs/template', '-D'], {
  //   stdio: 'inherit',
  // })

  // if (res.status !== 0) {
  //   console.log(res)
  //   throw res
  // }
}

module.exports = generateProject
