Array.prototype._map = function (executor) {
  if (!(executor instanceof Function)) {
    throw new Error(`${executor} is not a function`)
  }
  let index = 0
  const result = []
  for (item of this) {
    result.push(executor(item, index++, this))
  }
  return result
}

// test
const arr = [1, 2, 3]
console.log(arr._map(x => x * 2))
