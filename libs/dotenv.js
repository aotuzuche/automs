const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs')
const paths = require('./paths')

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')]

if (!fs.existsSync(paths.dotenv)) {
  return
}

dotenvExpand(dotenv.config({ path: paths.dotenv }))
