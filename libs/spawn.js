const path = require('path')
const spawn = require('cross-spawn')

class Spawn {
  static bin(script, args) {
    const a = args && Array.isArray(args) ? [...args] : args !== void 0 ? [args] : []
    const res = spawn.sync(process.execPath, [path.resolve(__dirname, '..', 'bin', script), ...a], {
      stdio: 'inherit',
    })
    if (res.status !== 0 && res.error) {
      console.error(res.error)
    }
    return res
  }
}

module.exports = Spawn
