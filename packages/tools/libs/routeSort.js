const toValue = str => {
  if (str === '*') return 1e11 // wild
  if (/^\:(.*)\?/.test(str)) return 1111 // param optional
  if (/^\:(.*)\./.test(str)) return 11 // param w/ suffix
  if (/^\:/.test(str)) return 111 // param
  return 1 // static
}

const toRank = str => {
  let i = 0
  let out = ''
  let arr = str.split('/')
  for (; i < arr.length; i++) out += toValue(arr[i])
  return (i - 1) / Number(out)
}

const routeSort = (arr, cache) => {
  cache = {}
  return arr.sort((a, b) => {
    cache[a] = cache[a] || toRank(a)
    cache[b] = cache[b] || toRank(b)
    return cache[b] - cache[a]
  })
}

module.exports = routeSort
