class ConvertCase {
  static pascalize(str) {
    return ('_' + str).replace(/_(\w)/g, match => match[1].toUpperCase())
  }

  static camelize(str) {
    return str.replace(/_(\w)/g, match => match[1].toUpperCase())
  }

  static snakify(str) {
    return str.replace(/[A-Z]/g, match => '_' + match[0]).toLowerCase()
  }

  static dashfy(str) {
    return str.replace(/[A-Z]/g, match => '-' + match[0]).toLowerCase()
  }
}

module.exports = ConvertCase
