const inquirer = require('inquirer')

const askReplaceQuestions = async () => {
  const res = await inquirer.prompt({
    type: 'confirm',
    name: 'replace',
    message: '目录已存在，是否替换？',
    default: false,
  })

  return res.replace
}

module.exports = askReplaceQuestions
