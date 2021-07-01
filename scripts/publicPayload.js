const fs = require('fs-extra')
const paths = require('../libs/paths')

// 携带public下额外文件至打包目录
const main = () => {
  if (!fs.existsSync(paths.appBuild) || !fs.existsSync(paths.appPublic)) {
    return
  }

  fs.copySync(paths.appPublic, paths.appBuild, {
    filter: src => {
      if (src.endsWith('.html') || src.endsWith('asset-manifest.json')) {
        return false
      }
      return true
    },
  })
}

module.exports = main(process.argv.slice(2))
