Promise.prototype._finally = function (fn) {
  return this.then( // 此处 return 可以保证链式调用
    (data) => {
      fn()
      return data // 保证正常的 onFulfilled 可以正常依次触发
    },
    (e) => {
      fn()
      throw e
    }
  )
}

// test

Promise.resolve(1)._finally(() => {
  console.log(1)
})

Promise.reject(2)._finally(() => {
  console.log(2)
})
