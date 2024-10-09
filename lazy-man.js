function LazyMan(name) {
  const task = [() => sayHi(name)]
  const sayHi = function (name) {
    return Promise.resolve(console.log(`Hi, this is ${name}`))
  }
  this.sleep = function (interval) {
    task.push(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`wake up after ${interval}`)
          resolve()
        }, interval * 1000)
      })
    })
    return this
  }
  this.eat = function (food) {
    task.push(() => {
      return Promise.resolve(console.log(`Eat ${food}`))
    })
    return this
  }
  this.sleepFirst = function (interval) {
    task.unshift(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`wake up after ${interval}`)
          resolve()
        }, interval * 1000)
      })
    })
    return this
  }
  Promise.resolve().then(() => {
    task.reduce((p, c) => {
      return p.then(c)
    }, Promise.resolve())
  })
  return this
}

// test
LazyMan("Hank")
LazyMan("Hank").sleep(10).eat("dinner")
LazyMan("Hank").eat("dinner").eat("supper")
LazyMan("Hank").sleepFirst(5).eat("supper")

