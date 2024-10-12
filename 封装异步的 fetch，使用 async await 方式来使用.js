const request = async function (url, data) {
  const response = await fetch(url, data)
  if (!response.ok) {
    throw new Error("request refused")
  }
  return request.packUtils(response)
}

request.packUtils = function (data) {
  const data = data
  return {
    async getJson() {
      return data.json()
    },
    getData() {
      return data
    },
  }
}

request.post = function (url, data) {
  return request(url, { ...data, method: "post" })
}

// test

request
  .post("https://example.com/someAPI", {
    foo: "aa",
  })
  .getJson()
