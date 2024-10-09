Function.prototype._call = function (context, ...args) {
  context = context === undefined || context === null ? window : context
  // 如果context不为对象，则需要转换为对象
  if (Object(context) !== context) {
    context = Object(context)
  }
  // 如果args为空，则转换为空数组
  args = args === undefined || args === null ? [] : args
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype._apply = function (context, args) {
  context = context === undefined || context === null ? window : context
  // 如果context不为对象，则需要转换为对象
  if (Object(context) !== context) {
    context = Object(context)
  }
  // 如果args为空，则转换为空数组
  args = args === undefined || args === null ? [] : args
  // 如果 args 不为数组，则需要包装为数组
  if (!Array.isArray(args)) {
    args = [args]
  }
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype.bind = function (context, ...args) {
  context = context === undefined || context === null ? window : context
  // 如果context不为对象，则需要转换为对象
  if (Object(context) !== context) {
    context = Object(context)
  }
  // 如果args为空，则转换为空数组
  args = args === undefined || args === null ? [] : args
  const that = this
  return function (...appendArgs) {
    context.__fn = that
    appendArgs = appendArgs === undefined || appendArgs === null ? [] : appendArgs
    if (!Array.isArray(appendArgs)) {
      appendArgs = [appendArgs]
    }
    let result = context.__fn(...args, ...appendArgs)
    delete context.__fn
    return result
  }
}
