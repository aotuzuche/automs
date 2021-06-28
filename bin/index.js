const PackageVersion = require('./libs/packageVersion')

const res = PackageVersion.compare('ora')
res.then(console.log)
