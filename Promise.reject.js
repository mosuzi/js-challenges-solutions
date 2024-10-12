// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
Promise._reject = function (reason) {
  // 与 Promise.resolve() 不同，即使 reason 已经是一个 Promise 对象，Promise.reject() 方法也始终会将其封装在一个新的 Promise 对象中。
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}
