// 寄生组合式继承
const Parent = function (name) {
  this.name = name
}
Parent.prototype.getName = function () {
  return this.name
}

const Child = function (name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype.getAge = function () {
  return this.age
}

// Child.__proto__ = Parent
// Child.prototype.__proto__ = Parent.prototype
// 以上两行更优雅的写法：
Reflect.setPrototypeOf(Child, Parent)
Reflect.setPrototypeOf(Child.prototype, Parent.prototype)

const child = new Child("aa", 10)
console.log(child.getAge())
console.log(child.getName())
