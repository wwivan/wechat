const express = require("express")

const app = express()
const auth = require("./wechat/auth")

app.use(auth())

app.listen(3000, () => {
  console.log("服务器启动成功")
})