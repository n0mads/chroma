
function valuesOf(object) {
  return Object.keys(object).map(key => object[key])
}


function removeNulls(object) {
  for (let key in object) if (object[key] == null) delete object[key]
  return object
}


function parseBoolean(string) {
  if (! string) return string
  else if (string.toLowerCase() === 'true') return true
  else if (string.toLowerCase() === 'false') return false
  else return null
}


const NUMERIC = /^(\-|\+)?([0-9]+)$/

function parseInteger(string) {
  if (! string) return string
  else if (NUMERIC.test(string)) return Number(value)
  else return null
}


module.exports = {
  valuesOf,
  parseBoolean,
  parseInteger,
  removeNulls
}
