const logger = require('../libs/logger')
const addPackageScripts = require('../scripts/addPackageScripts')
const updateTemplate = require('../scripts/updateTemplate')
const updatePackages = require('../scripts/updatePackages')

const main = async () => {
  try {
    logger.spin('开始检查')
    await addPackageScripts()
    await updateTemplate()
    await updatePackages()
    logger.succeed('检查完成')
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
