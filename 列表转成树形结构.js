const listToTree = function (list) {
  const head = {}
  const map = list.reduce((p, c) => {
    p[c.id] = c
    head[c.id] = true
    return p
  }, {})
  list.forEach((item) => {
    if (map[item.pid]) {
      delete head[item.id]
      if (!map[item.pid].children) map[item.pid].children = []
      map[item.pid].children.push(item)
    }
  })
  return Object.keys(head).map(key => map[key])
}

// test

const data = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
  { id: 6, name: "部门6", pid: 0 },
]

console.log(listToTree(data))
