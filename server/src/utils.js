
function valuesOf(object) {
  return Object.keys(object).map(key => object[key])
}


module.exports = {
  valuesOf  
}
