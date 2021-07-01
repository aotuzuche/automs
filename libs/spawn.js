const path = require('path')
const spawn = require('cross-spawn')

class Spawn {
  bin(script, args) {
    const a = args && Array.isArray(args) ? [...args] : [args]
    return spawn.sync(process.execPath, [path.resolve(__dirname, '..', 'bin', script), ...a], {
      stdio: 'inherit',
    })
  }

  scripts(script, args) {
    const a = args && Array.isArray(args) ? [...args] : [args]
    return spawn.sync(process.execPath, [path.resolve(__dirname, '..', 'scripts', script), ...a], {
      stdio: 'inherit',
    })
  }
}

module.exports = new Spawn()
