String.prototype.render = function (data) {
  if (data === undefined || data === null) {
    return this
  }
  let newStr = this
  const reg = new RegExp(/{{\s*[.\s\S]*?\s*}}/g)
  const matcher = this.match(reg)
  if (matcher) {
    for (m of matcher) {
      const key = m.slice(2, -2).trim()
      if (key in data) {
        newStr = newStr.replace(m, data[key])
      } else if (key.startsWith('#')) {
        const result = eval(key.slice(1))
        newStr = newStr.replace(m, result)
      }
    }
  }
  return newStr
}

// test

const data = {
  name: "小明",
  age: 16,
  school: "第三中学",
  classroom: "教室2",
}

console.log(
  "{{ name }} 今年 {{ age }} 岁，就读于 {{ school }} 今天在 {{ classroom }} 上课，{{ name }} {{ #data.age >= 18 ? '成年了' : '未成年' }}".render(
    data
  )
)

console.log(
  `{{name}}说了句{{#
      if (data.age >= 18) {
          "我已经成年了！"
      } else {
          "我还没有成年！"
      }
  }}`.render(data)
);
