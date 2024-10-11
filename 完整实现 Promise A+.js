// 使用 Object.freeze 避免对象被篡改
const STATUS = Object.freeze({
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
})

const isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj).toLocaleLowerCase() === '[object ' + type + ']'
  }
}

const isObject = isType('object')

const isFunction = isType('function')

const isPromise = function (promise) {
  return promise instanceof MyPromise
}

const runCallbacks = function (cbs, value) {
  // 顺次执行回调
  cbs.forEach((cb) => cb(value))
}

/**
 * 将 promise 置为 fulfilled 状态（如果可行的话）
 * @param {*} promise 准备改变的 promise 对象
 * @param {*} value promise 变成 fulfilled 状态时的结果值
 */
const fulfillPromise = function (promise, value) {
  // 不允许 pending 态以外的状态改变
  if (promise.status !== STATUS.PENDING) return
  promise.value = value
  promise.status = STATUS.FULFILLED
  runCallbacks(promise.fulfilledCallbacks, value)
}

/**
 * 将 promise 置为 rejected 状态（如果可行的话）
 * @param {*} promise 准备改变的 promise 对象
 * @param {*} reason promise 变成 rejected 状态时的拒因
 * @returns
 */
const rejectPromise = function (promise, reason) {
  // 不允许 pending 态以外的状态改变
  if (promise.status !== STATUS.PENDING) return
  promise.status = STATUS.REJECTED
  promise.reason = reason
  runCallbacks(promise.rejectedCallbacks, reason)
}

/**
 * 决议 promise，根据 value 选择将 promise 置为 fulfilled 或 rejected 状态
 * @param {*} promise 要决议的 promise
 * @param {*} x 决议 promise 需要的值
 */
const resolvePromise = function (promise, x) {
  // x 与 promise 相同，则以一个 TypeError 拒绝 promise
  if (x === promise) {
    rejectPromise(promise, new TypeError('resolving promise must not use the same promise'))
  } else if (isPromise(x)) {
    // 如果 x 是一个 promise
    if (x.status === STATUS.FULFILLED) {
      // 当 x 已满足时，以 x 的结果值满足 promise
      fulfillPromise(promise, x.value)
    } else if (x.status === STATUS.REJECTED) {
      // 当 x 被拒绝时，以 x 的拒因拒绝 promise
      rejectPromise(promise, x.reason)
    } else {
      // 当 x 待定时，等待 x 被满足或者被拒绝
      x.then(
        (v) => {
          // x 被满足，则以 x 的结果值满足 promise
          fulfillPromise(promise, v)
        },
        (r) => {
          // x 被拒绝，则以 x 的拒因拒绝 promise
          rejectPromise(promise, r)
        }
      )
    }
  } else if (isObject(x) || isFunction(x)) {
    // 如果 x 是一个对象或者函数
    let then // 准备接收 x.then，此处设变量存储的原因可以见规范 3.5
    let called = false // 由于需要忽略多次调用 x.then，因此需要设置变量控制
    try {
      then = x.then
    } catch (e) {
      // 任何异常都会潜在拒绝 promise，此处有可能是无法取值导致的异常
      rejectPromise(promise, e)
      return
    }
    // 如果 then 是一个方法
    if (isFunction(then)) {
      try {
        // 尝试以 x 为 this 调用 then
        then.call(
          x,
          (v) => {
            // 此处传入的是 x.then 的 'onFulfilled' 方法，内部调用 resolvePromise 决议 promise
            if (!called) {
              called = true
              resolvePromise(promise, v)
            }
          },
          (r) => {
            // 此处传入的是 x.then 的 'onRejected' 方法，内部调用 rejectPromise 拒绝 promise
            if (!called) {
              called = true
              rejectPromise(promise, r)
            }
          }
        )
      } catch (e) {
        // 任何异常都会潜在拒绝 promise，此处还应该避免 x.then 的多次调用
        if (!called) {
          called = true
          rejectPromise(promise, e)
        }
      }
    } else {
      // 如果 then 不是一个方法，则以 x 为结果值满足 promise
      fulfillPromise(promise, x)
    }
  } else {
    // 如果 x 不是一个对象或者函数，则以 x 为结果值满足 promise
    fulfillPromise(promise, x)
  }
}

/**
 * 模拟异步调用并决议 promise
 * @param {*} promise 要决议的 promise
 * @param {*} func 决议 promise 时调用的回调方法
 * @param {*} value 决议 promise 时传入回调方法的参数，可以是结果值，也可以是拒因
 */
const simulateAsyncCall = function (promise, func, value) {
  setTimeout(() => {
    try {
      const x = func(value)
      resolvePromise(promise, x)
    } catch (e) {
      // 异步调用发生异常，立即以异常拒绝 promise
      rejectPromise(promise, e)
    }
  }, 0)
}

class MyPromise {
  constructor(fn) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []
    fn(
      (value) => {
        resolvePromise(this, value)
      },
      (reason) => {
        rejectPromise(this, reason)
      }
    )
  }
  then(onFulfilled, onRejected) {
    const promise1 = this
    const promise2 = new MyPromise(() => {})
    if (promise1.status === STATUS.FULFILLED) {
      if (isFunction(onFulfilled)) {
        simulateAsyncCall(promise2, onFulfilled, promise1.value)
      } else {
        /**
         * promise1 的状态是 fulfilled 并且 onFulfilled 不为函数
         * 按照规范，应该将返回的 promise2 也置为与 promise1 相同的状态
         */
        fulfillPromise(promise2, promise1.value)
      }
    } else if (promise1.status === STATUS.REJECTED) {
      if (isFunction(onRejected)) {
        simulateAsyncCall(promise2, onRejected, promise1.reason)
      } else {
        /**
         * promise1 的状态是 rejected 并且 onRejected 不为函数
         * 按照规范，应该将返回的 promise2 也置为与 promise1 相同的状态
         */
        rejectPromise(promise2, promise1.reason)
      }
    } else {
      // 这里的 else 相当于 else if (promise1.status === STATUS.PENDING)
      // 此处若不做默认值处理，则会导致异步调用方法时报错，按照规范应该忽略
      onFulfilled = isFunction(onFulfilled)
        ? onFulfilled
        : (value) => {
            return value
          }
      onRejected = isFunction(onRejected)
        ? onRejected
        : (err) => {
            throw err
          }
      // 将异步回调推入回调队列
      promise1.fulfilledCallbacks.push((value) => {
        simulateAsyncCall(promise2, onFulfilled, value)
      })
      promise1.rejectedCallbacks.push((reason) => {
        simulateAsyncCall(promise2, onRejected, reason)
      })
    }
    // then 方法必须返回一个 promise
    return promise2
  }
}

MyPromise.deferred = function () {
  const deferred = {}
  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

module.exports = MyPromise
