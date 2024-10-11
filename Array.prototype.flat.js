Array.prototype._flat = function (deep = 1) {
  const newArr = []
  const stack = [...this]
  const increaseDeepFlag = Symbol("increase deep")
  while (stack.length) {
      const next = stack.shift()
      if (Array.isArray(next) && deep) {
          Array.prototype.unshift.call(stack, ...next, increaseDeepFlag)
          deep--
      } else if (next === increaseDeepFlag) {
          deep++
      } else {
          newArr.push(next)
      }
  }
  return newArr
}
// test

const arr = [1, 2, 3, 4, [5, 6, [7, 8, [9, 10]]]]

console.log(arr._flat(5))
debugger
