const fs = require('fs')
const path = require('path')

try {
  fs.unlinkSync('node_modules/@automs')
} catch (_) {}
fs.symlinkSync(path.resolve(__dirname, 'packages'), 'node_modules/@automs')
