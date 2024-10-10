MyPromise.all = function (promises) {
  // 异常处理
  if (!(typeof promises === 'object' && promises!==null&& typeof promises[Symbol.iterator]==='function')) {
    throw new Error('argument is not iterable')
  }
  return new Promise((resolve, reject) => {
    try {
      const result = []
      let count = 0
      let fulfilledCount = 0
      for (p of promises) {
        let i = count
        count++
        // 用 promise.resolve 包一层，防止p不是promise
        Promise.resolve(p).then((v) => {
          result[i] = v
          fulfilledCount++
          if (fulfilledCount === count) {
            resolve(result)
          }
        }, reject)
      }
      // 处理空数组
      if(count === 0) {
        resolve(result)
      }
    } catch (e) {
      reject(e)
    }
  })
}
