const fs = require('fs-extra')
const path = require('path')
const logger = require('./logger')

const checkRequiredFiles = files => {
  let currentFilePath = ''
  try {
    if (!Array.isArray(files)) {
      return
    }
    files.forEach(filePath => {
      currentFilePath = filePath
      fs.accessSync(filePath, fs.F_OK)
    })
    return true
  } catch (err) {
    const dirName = path.dirname(currentFilePath)
    const fileName = path.basename(currentFilePath)
    logger.error('Could not find a required file.')
    logger.error(`  Name: ${fileName}`)
    logger.error(`  Searched in: ${dirName}`)
    return false
  }
}

module.exports = checkRequiredFiles
