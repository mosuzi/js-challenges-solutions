const isNotNullObject = (obj) => typeof obj === "object" && obj !== null
const isFunction = fn => Object.prototype.toString.call(fn).toLocaleLowerCase() === '[object function]'
const isNumber = n => Object.prototype.toString.call(n).toLocaleLowerCase() === '[object number]'

const requestInterceptors = []
const responseInterceptors = []

const addRequestInterceptor = function(interceptor) {
  if (isFunction(interceptor)) {
    requestInterceptors.push(interceptor)
  }
}

const addResponseInterceptor = function(interceptor) {
  if (isFunction(interceptor)) {
    responseInterceptors.push(interceptor)
  }
}

const request = function (url, payload) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(payload.method || "get", url)
    if (isNotNullObject(payload.headers)) {
      Object.keys(payload.headers).forEach((hk) => {
        xhr.setRequestHeader(hk, payload.headers[hk])
      })
    }
    if (isNumber(payload.timeout)) {
      xhr.timeout = payload.timeout
    }
    const requestBody = payload.data
    xhr.send(requestBody)
    xhr.onload = function (e) {
      if (xhr.status !== 200) {
        reject(new Error(xhr))
      } else {
        resolve(xhr.response)
      }
    }
    xhr.onerror = function (e) {
      reject(new Error(e))
    }
    xhr.onabort = function () {
      reject(new Error("abort"))
    }
  })
}
