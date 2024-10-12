Promise.prototype._catch = function (fn) {
  this.then(null, fn) // onFulfilled 为 null 会被忽略，只需要将 fn 作为 onRejected 传入即可
}
