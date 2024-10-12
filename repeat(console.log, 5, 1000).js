// repeat(fn, timer, interval)
// 表示 fn 以 interval 的间隔重复调用 timer 次，返回包装后的新 fn，以使其可以传入参数自动重复调用

const repeat = function (fn, timer = 1, interval) {
  const innerCall = function (...args) {
    fn(...args)
    timer--
    if (timer) {
      const clearTimeoutFlag = setTimeout(() => {
        innerCall(...args)
        clearTimeout(clearTimeoutFlag)
      }, interval)
    }
  }
  return innerCall
}

// test

const autoRepeatConsole = repeat(console.log, 5, 1000)
autoRepeatConsole(1)
