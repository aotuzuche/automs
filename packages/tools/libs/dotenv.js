const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const paths = require('./paths')

class env {
  static inject(namespace) {
    // Make sure that including paths.js after env.js will read .env variables.
    delete require.cache[require.resolve('./paths')]

    if (!fs.existsSync(paths.dotenv) || !fs.existsSync(paths.appNodeModules)) {
      return
    }

    const envPath = path.resolve(paths.appNodeModules, '.automs', '.env')

    try {
      fs.removeSync(envPath)
    } catch (_) {}

    let envFile = String(fs.readFileSync(paths.dotenv))

    if (namespace === 'dev' && fs.existsSync(paths.dotenvDev)) {
      envFile += os.EOL + String(fs.readFileSync(paths.dotenvDev))
    }

    if (namespace === 'test' && fs.existsSync(paths.dotenvTest)) {
      envFile += os.EOL + String(fs.readFileSync(paths.dotenvTest))
    }

    fs.createFileSync(envPath)
    fs.writeFileSync(envPath, envFile)

    dotenvExpand(dotenv.config({ path: envPath }))
  }
}

module.exports = env
