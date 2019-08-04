// 验证服务器有效部分
const sha1 = require("sha1")
const config = require('../config')
const {
  getUserDataAsync
} = require("../utils/tool")
module.exports = () => {
  return async (req, res, next) => {
    const {
      signature,
      echostr,
      timestamp,
      nonce
    } = req.query
    const {
      token
    } = config
    const sha1Str = sha1([timestamp, nonce, token].sort().join(""))

    /*
    1.get
    2.post
    */
    if (req.method === "GET") {
      if (sha1Str === signature) {
        res.send(echostr)
      } else {
        res.end("error")
      }
    } else if (req.method === "POST") {
      if (sha1Str !== signature) {
        res.end("error")
      }
      console.log(req.query)

      const xmlData = await getUserDataAsync(req)
      console.log(xmlData)
      res.end("")
    } else {
      res.end("error")
    }

  }
}