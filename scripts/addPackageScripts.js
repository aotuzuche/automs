const spawn = require('cross-spawn')

// 修改项目package.json的script命令
const main = () => {
  if (setPackageScript('doctor', 'automs doctor').status !== 0) return
}

const setPackageScript = (key, value) => {
  const res = spawn.sync('npm', ['set-script', key, value], {
    stdio: 'inherit',
  })
  if (res.status !== 0 && res.error) {
    console.error(res.error)
  }
  return res
}

module.exports = main(process.argv.slice(2))
