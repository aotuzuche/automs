const fs = require('fs-extra')
const fetch = require('node-fetch')
const path = require('path')
const paths = require('./paths')

class PackageVersion {
  // 获取某个包在npm淘宝镜像上的最新版本
  static npm(name) {
    return new Promise(resolve => {
      fetch(`https://registry.npm.taobao.org/${name}/latest`)
        .then(res => res.json())
        .then(json => resolve(json.version))
        .catch(() => resolve(''))
    })
  }

  // 获取某个包在本地的版本
  static local(name) {
    const p = path.join(paths.appNodeModules, name, 'package.json')

    const exist = fs.existsSync(p)
    if (!exist) {
      try {
        const p = require(path.resolve(require.resolve(name), '..', 'package.json'))
        if (p && p.version) {
          return p.version
        }
      } catch (err) {}
      return ''
    }

    const json = fs.readJsonSync(p)
    return json.version || ''
  }

  // 比较版本
  static async compare(name) {
    const npm = await PackageVersion.npm(name)
    const local = PackageVersion.local(name)

    return {
      isSame: npm === local,
      isInstall: local !== '',
      local,
      last: npm,
    }
  }
}

module.exports = PackageVersion
