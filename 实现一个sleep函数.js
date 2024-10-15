function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

// test
;(async function () {
  console.log(1)
  await sleep(5000)
  console.log(2)
})()
