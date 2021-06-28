const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const Paths = require('./paths')

const PackageVersion = {
  // 获取某个包在npm淘宝镜像上的最新版本
  npm: (name) => {
    return new Promise(resolve => {
      fetch(`https://registry.npm.taobao.org/${name}/latest`)
        .then(res => res.json())
        .then(json => resolve(json.version))
        .catch(() => resolve(''))
    })
  },

  // 获取某个包在本地的版本
  local: (name) => {
    const p = path.join(Paths.appNodeModules, name, 'package.json')
    
    const exist = fs.existsSync(p)
    if (!exist) {
      return ''
    }

    const f = String(fs.readFileSync(p))
    return JSON.parse(f || '{}').version || ''
  },

  // 比较版本
  compare: async (name) => {
    const npm = await PackageVersion.npm(name)
    const local = PackageVersion.local(name)

    return {
      isSame: npm === local,
      isInstall: local !== '',
      last: npm,
    }
  },
}

module.exports = PackageVersion
