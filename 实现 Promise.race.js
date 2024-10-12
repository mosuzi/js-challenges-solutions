// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

/**
 * 如果第一个敲定的 promise 被兑现，那么返回的 promise 也会被兑现；如果第一个敲定的 promise 被拒绝，那么返回的 promise 也会被拒绝。如果传入的 iterable 为空，返回的 promise 就会一直保持待定状态。如果传入的 iterable 非空但其中没有任何一个 promise 是待定状态，返回的 promise 仍会异步敲定（而不是同步敲定）
 * @param {*} promises 一个 promise 可迭代对象（例如数组）
 * @returns 一个 Promise，会以 iterable 中第一个敲定的 promise 的状态异步敲定
 */
Promise._race = function (promises) {
  // 非可迭代的对象会抛错
  if (
    !(
      typeof promises !== "object" &&
      promises !== null &&
      typeof promises[Symbol.iterator] === "function"
    )
  ) {
    throw new Error(`${promises} is not iterable`)
  }
  return new Promise((resolve, reject) => {
    try {
      for (p of promises) {
        Promise.resolve(p).then(resolve, reject)
      }
    } catch (e) {
      reject(e)
    }
  })
}
