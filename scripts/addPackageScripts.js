const spawn = require('cross-spawn')

// 修改项目package.json的script命令
const addPackageScripts = async () => {
  await setPackageScript('doctor', 'automs doctor')
  await setPackageScript('doctor', 'automs doctor')
}

const setPackageScript = (key, value) => {
  return new Promise((resolve, reject) => {
    const res = spawn.sync('npm', ['set-script', key, value], {
      stdio: 'inherit',
    })
    if (res.status !== 0 && res.error) {
      reject(res)
      return
    }
    resolve(res)
  })
}

module.exports = addPackageScripts
