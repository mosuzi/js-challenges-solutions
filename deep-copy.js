const deepCopy = function (obj) {
  const copyCache = new WeakMap()
  const executor = function (item) {
    if (typeof item === "object") {
      if (item === null) {
        return null
      }
      if (copyCache.has(item)) return copyCache.get(item)
      const result = Array.isArray(item)
        ? item.map((e) => executor(e))
        : Object.keys(item).reduce((p, c) => {
            p[c] = executor(item[c])
            return p
          }, {})
      copyCache.set(item, result)
      return result
    }
    return item
  }
  return executor(obj)
}

var inner = { cc: "cc" }
var middle = { middle: { inner, k: "middle" } }
var outer = { foo: "a", c: [middle, inner] }

var newA = deepCopy(outer)

console.log(newA.c === middle)
console.log(newA.c[0].inner === inner)
console.log(newA.c[1] === inner)
