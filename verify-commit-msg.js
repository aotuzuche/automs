const chalk = require('chalk')
const fs = require('fs')

if (!process.argv[2] || !fs.existsSync(process.argv[2])) {
  return
}

const msg = fs.readFileSync(process.argv[2], 'utf-8').trim()

const commitRE =
  /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build|v)(\(.+\))?: .{1,50}/

if (!/^v\d+\.\d+\.\d+/.test(msg) && !commitRE.test(msg)) {
  console.log()
  console.error(`  ${chalk.bgRed.white(' ERROR ')} 无效的提交信息`)
  console.log()
  process.exit(1)
}
