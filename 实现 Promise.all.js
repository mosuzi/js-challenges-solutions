// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

/**
 * 返回一个 Promise，其状态为：
 *
 * - 已兑现（already fulfilled），如果传入的 iterable 为空。
 * - 异步兑现（asynchronously fulfilled），如果给定的 iterable 中所有的 promise 都已兑现。兑现值是一个数组，其元素顺序与传入的 promise 一致，而非按照兑现的时间顺序排列。如果传入的 iterable 是一个非空但不包含待定的（pending）promise，则返回的 promise 依然是异步兑现，而非同步兑现。
 * - 异步拒绝（asynchronously rejected），如果给定的 iterable 中的任意 promise 被拒绝。拒绝原因是第一个拒绝的 promise 的拒绝原因。
 * @param {*} promises 一个可迭代对象，例如 Array 或 String。
 * @returns 一个 Promise
 */
Promise._all = function (promises) {
  // 非可迭代的对象会抛错
  if (
    !(
      typeof promises === "object" &&
      promises !== null &&
      typeof promises[Symbol.iterator] === "function"
    )
  ) {
    throw new Error(`${promises} is not iterable`)
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
      if (count === 0) {
        resolve(result)
      }
    } catch (e) {
      reject(e)
    }
  })
}
