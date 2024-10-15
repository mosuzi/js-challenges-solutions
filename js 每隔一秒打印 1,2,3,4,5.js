// 创建多个 setTimeout
for (let i = 0; i < 5; i++) {
  setTimeout(console.log, 1000 * i, i + 1)
}

// 使用 setInterval
let i = 1
console.log(i++)
const id = setInterval(() => {
  console.log(i++)
  if (i > 5) {
    clearInterval(id)
  }
}, 1000)

// 使用 generate 函数
const generateNumber = function* () {
  for (let i = 0; i < 5; i++) {
    yield i
  }
}

const numberGenerator = generateNumber()

const run = function (fn) {
  const number = numberGenerator.next()
  if (!number.done) {
    fn(number.value + 1)
    const id = setTimeout(() => {
      clearTimeout(id)
      run(fn)
    }, 1000)
  }
}

run(console.log)
