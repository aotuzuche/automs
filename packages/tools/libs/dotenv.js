const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs')
const paths = require('./paths')

class env {
  static inject(namespace) {
    // Make sure that including paths.js after env.js will read .env variables.
    delete require.cache[require.resolve('./paths')]

    if (!fs.existsSync(paths.dotenv)) {
      return
    }

    const baseEnv = dotenv.config({ path: paths.dotenv })

    if (namespace === 'dev' && fs.existsSync(paths.dotenvDev)) {
      const parsed = dotenv.config({ path: paths.dotenvDev }).parsed
      baseEnv.parsed = { ...baseEnv.parsed, ...parsed }
    }

    if (namespace === 'test' && fs.existsSync(paths.dotenvTest)) {
      const parsed = dotenv.config({ path: paths.dotenvTest }).parsed
      baseEnv.parsed = { ...baseEnv.parsed, ...parsed }
    }

    dotenvExpand(baseEnv)
  }
}

module.exports = env
