const q = require('inquirer')

const PackageVersion = require('../libs/packageVersion')

const args = process.argv.slice(2)

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test',
)

console.log(args)

const res = PackageVersion.compare('ora')
res.then(console.log)
