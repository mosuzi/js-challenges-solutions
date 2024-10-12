// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

/**
 * 返回一个 Promise，其状态为
 * - 已兑现（already fulfilled），如果传入的 iterable 为空的话。
 * - 异步兑现（asynchronously fulfill），当给定的 iterable 中所有 promise 已经敲定时（要么已兑现，要么已拒绝）。兑现的值是一个对象数组，其中的对象按照 iterable 中传递的 promise 的顺序，描述每一个 promise 的结果，无论完成顺序如何。每个结果对象都有以下的属性：
 *   - status 一个字符串，要么是 "fulfilled"，要么是 "rejected"，表示 promise 的最终状态。
 *   - value 仅当 status 为 "fulfilled"，才存在。promise 兑现的值。
 *   - reason 仅当 status 为 "rejected"，才存在，promsie 拒绝的原因。
 * 如果传入的 iterable 是非空的，但不包含待定的（pending）promise，则返回的 promise 仍然是异步兑现的，而不是同步兑现。
 * @param {*} promises 一个以 promise 组成的可迭代对象（例如 Array）对象
 * @returns 一个 Promise
 */
Promise._allSettled = function (promises) {
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
      let settledCount = 0
      for (ps of promises) {
        let index = count++
        Promise.resolve(ps)
          .then(
            (v) => {
              result[index] = {
                status: "fulfilled",
                value: v,
              }
            },
            (e) => {
              result[index] = {
                status: "rejected",
                reason: e,
              }
            }
          )
          .finally(() => {
            settledCount++
            if (settledCount === count) {
              resolve(result)
            }
          })
      }
      if (count == 0) {
        resolve(result)
      }
    } catch (e) {
      reject(e)
    }
  })
}
