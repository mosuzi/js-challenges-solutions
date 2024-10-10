class EventEmitter {
  constructor() {
    this.events = {}
  }
  emit(event, ...args) {
    const executor = (arr) => {
      if (!arr || !arr.length) return
      arr.forEach((cb) => {
        cb.call(this, ...args)
      })
    }
    if (event === "*") {
      executor(Object.values(this.events))
    } else {
      executor(this.events[event])
      executor(this.events["*"])
    }
  }
  on(event, cb) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(cb)
  }
  off(event, cb) {
    if (!this.events[event]) return
    if (cb === undefined || cb === null) {
      delete this.events[event]
    } else {
      this.events[event] = this.events[event].filter(
        (callback) => callback !== cb
      )
    }
  }
}
