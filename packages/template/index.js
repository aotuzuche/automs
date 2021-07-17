const pachageJson = require('./package.json')

const main = () => {
  console.log(`当前模板版本 ${pachageJson.version}`)
}

module.exports = main
