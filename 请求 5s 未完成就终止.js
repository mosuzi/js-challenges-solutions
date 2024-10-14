const autoTimeoutRequest = function (url, data = {}) {
  // promise，5秒到了发送 AbortController
  const abortController = new AbortController()

  let flag
  setTimeout(() => {
    flag = setTimeout(() => {
      clearTimeout(flag)
      abortController.abort(new Error('timeout after 5s'))
    }, 5000)
  })
  return new Promise((resolve, reject) => {
    const fetchData = { ...data }
    fetchData.signal = abortController.signal
    fetch(url, fetchData)
      .then((v) => {
        if (!v.ok) {
          reject(new Error("failed to get response"))
        } else {
          resolve(v.text())
        }
      }, reject)
      .finally(() => {
        clearTimeout(flag)
      })
  })
}

//test
autoTimeoutRequest("http://example.com/someApi").then(
  (v) => {
    console.log(v)
  },
  (e) => {
    console.log(e)
  }
)
