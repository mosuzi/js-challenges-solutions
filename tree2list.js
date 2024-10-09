const treeToList = function (tree) {
  const stack = [...tree]
  const result = []
  while (stack.length) {
    const node = stack.pop()
    result.push(node)
    if (node.children) {
      Array.prototype.push.apply(stack, node.children)
    }
  }
  return result
}

// test

const tree = [
  {
    id: 1,
    text: "节点1",
    parentId: 0,
    children: [
      {
        id: 2,
        text: "节点1_1",
        parentId: 1,
      },
    ],
  },
]

console.log(treeToList(tree))
