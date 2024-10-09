const instanceofFunc = function (obj, Ctor) {
  if (!(typeof Ctor === "object" && Ctor !== null)) {
    throw new Error("Right-hand side of instanceof is not an object")
  }
  let protoChain = Object.getPrototypeOf(obj)
  while (protoChain) {
    if (protoChain === Ctor.prototype) {
      return true
    }
    protoChain = Object.getPrototypeOf(protoChain)
  }
  return false
}
