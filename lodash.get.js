const getStrPath = function (path) {
  return path.replace(/\[['"]?(.+?)['"]?\]/g, ".$1").split(".")
}
const getValueByPath = function (obj, path) {
  if (!(typeof obj === "object" && obj !== null && path)) return
  let realPath = []
  if (Array.isArray(path)) {
    realPath = path
  } else if (typeof path === "string") {
    realPath = getStrPath(path)
  }
  return realPath.reduce((p, c) => {
    if (p !== null) {
      return p[c]
    }
    return null
  }, obj)
}

// test

const obj = {
  a: {
    b: 123,
  },
  arr: [
    {
      demo: "demo",
    },
  ],
}

console.log(getValueByPath(obj, 'arr["0"].demo'));
console.log(getValueByPath(obj, "a['b']"))
