class LimitSchedule {
  constructor(limit = 5) {
    this.queue = []
    this.limit = limit
    this.pending = 0
  }
  dequeue() {
    while (this.queue.length && this.pending < this.limit) {
      this.pending++
      const { task, resolve, reject } = this.queue.shift()
      task()
        .then(resolve, reject)
        .finally(() => {
          this.pending--
          this.dequeue()
        })
    }
  }
  run(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.dequeue()
    })
  }
}

// use

const limitSchedule = new LimitSchedule(3)
const task = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(Math.random())
      resolve()
    }, 5000)
  })
}
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
limitSchedule.run(task)
