// 封装一个工具函数输入一个 promiseA 返回一个 promiseB。如果 promiseA 超过 1s 没返回，则抛出异常，否则以 promiseA 决议 promiseB

const timeLimitRun = function (promise) {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("timeout")
      }, 1000)
    }),
  ])
}
