const intervalIdMap = new Map()
const _setInterval = function (fn, wait, ...args) {
  const id = Date.now()
  let timeoutId
  const continueConfig = {
    _status: true,
    get status() {
      return this._status
    },
    set status(s) {
      if (!s) {
        this._status = s
        _clearTimeout(timeoutId)
      }
    },
  }
  intervalIdMap.set(id, continueConfig)
  const _clearTimeout = function (id) {
    clearTimeout(id)
    intervalIdMap.delete(id)
  }
  const run = function () {
    timeoutId = setTimeout(() => {
      fn(...args)
      _clearTimeout(timeoutId)
      if (continueConfig.status) {
        run()
      }
    }, wait)
  }
  run()
  return id
}

const _clearInterval = function (id) {
  if (intervalIdMap.has(id)) {
    const continueConfig = intervalIdMap.get(id)
    continueConfig.status = false
  }
}


// test
let count = 0
const id = _setInterval(() => {
  count++
  console.log(1)
  if (count > 5) {
    _clearInterval(id)
  }
}, 1000)
// Expect output: 1 (6 times)
