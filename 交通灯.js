// 题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promise 实现）

const lightConfigQueue = [
  {
    color: "red",
    interval: 3,
  },
  { color: "green", interval: 1 },
  {
    color: "yellow",
    interval: 2,
  },
]

const light = function (config) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${config.color} light`)
      resolve(config)
    }, config.interval * 1000)
  })
}

lightConfigQueue.forEach((item, index, arr) => {
  if (index < arr.length - 1) {
    item.next = arr[index + 1]
  } else {
    item.next = arr[0]
  }
})

const run = function(fn, value) {
  fn(value).then(config => run(fn, config.next))
}

run(light, lightConfigQueue[0])
