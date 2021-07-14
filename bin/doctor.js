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
    // 检查component名是否与目录名相同, component是否在该在的目录内
    // 检查子组件是否为纯函数
    // 检查根css名是否有冲突, 检查css名是否有大写, 根css不能x-开头
    // 检查是否关闭lint
    // 检查console
    // 检查循环组件是否用index
    // 检查function
    // 检查无用的reducer effect
    // 能用@引用的地方尽量改为@
    // 检查model的namespace是否冲突
    logger.succeed('检查完成')
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = main(process.argv.slice(2))
