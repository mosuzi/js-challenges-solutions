const isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === "[object " + type + "]"
  }
}

const isObject = isType("object")

const isFunction = isType("function")

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
Promise._resolve = function (ps) {
  // 如果 ps 是 promise 则直接返回
  if (ps instanceof Promise) return ps
  return new Promise((resolve, reject) => {
    // 如果 ps 是一个 thenable
    // thenable 首先是一个对象或者函数
    if (isObject(ps) || isFunction(ps)) {
      let then
      let called = false
      try {
        then = ps.then
      } catch (e) {
        reject(e)
      }
      // 其次 thenable 包含一个 then 方法
      // 那么将调用这个 then 方法，并传入两个回调函数，分别调用 resolve 和 reject 决议 promise
      if (isFunction(then)) {
        try {
          then.call(
            ps,
            (v) => {
              if (!called) {
                // 防止多次执行回调
                called = true
                resolve(v)
              }
            },
            (r) => {
              if (!called) {
                // 防止多次执行回调
                called = true
                reject(r)
              }
            }
          )
        } catch (e) {
          if (!called) {
            // 防止多次执行回调
            called = true
            reject(e)
          }
        }
      } else {
        resolve(ps)
      }
    } else {
      // 其他的值会直接满足当前 promise
      resolve(ps)
    }
  })
}

// test

Promise._resolve({ then: (resolve) => resolve("xx") }).then((res) =>
console.log(res)
// Expected output: xx
)

const promise1 = Promise.resolve(123);

promise1.then((value) => {
  console.log(value);
  // Expected output: 123
});
