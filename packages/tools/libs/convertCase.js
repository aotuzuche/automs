class ConvertCase {
  static pascalize(str) {
    return ('_' + str).replace(/_(\w)/g, match => match[1].toUpperCase())
  }

  static camelize(str) {
    return str.replace(/_(\w)/g, match => match[1].toUpperCase())
  }

  static snakify(str) {
    let res = str.replace(/[A-Z]/g, match => '_' + match[0]).toLowerCase()
    res = res.replace(/^_/, '')
    return res
  }

  static dashfy(str) {
    let res = str.replace(/[A-Z]/g, match => '-' + match[0]).toLowerCase()
    res = res.replace(/^-/, '')
    return res
  }
}

module.exports = ConvertCase
