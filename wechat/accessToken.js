/*
 获取access_token
 微信调用接口全局唯一凭据
 特点：
 唯一的
 有效期2小时
 请求地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  get
  设计思路：
  1.首次本地没有，发送请求获取access_token,保存下来（本地文件）
  2.第二次或以后：
    -先去本地读取文件，判断是否过期
      -过期了
        -重新请求获取access_token,保存下来覆盖之前的文件（保证文件是唯一的）
      -未过期
        -直接使用
  整理思路：
  读取本地文件（readAccessToken）
    -本地有文件
      -判断是否过期（isValidAccessToken）
        -过期了
          -重新请求获取access_token（getAccessToken）,保存下来覆盖之前的文件（保证文件是唯一的）（saveAccessToken）
        -未过期
          -直接使用
    -本地没有文件
      -发送请求获取access_token（getAccessToken）,保存下来（本地文件）（saveAccessToken），直接使用
*/
const {
  appID,
  appsecret
} = require("../config")
const rp = require("request-promise-native")
const {
  writeFile,
  readFile
} = require('fs')
class Wechat {
  constructor() {

  }
  getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
    return new Promise((resove, reject) => {
        rp({
          method: "GET",
          url,
          json: true
        }).then(res => {
          console.log(res)
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resove(res)
        })
      })
      .catch(err => {
        console.log(err)
        reject("getAccessToken方法除了问题：" + err)
      })
  }

  saveAccessToken(accessToken) {
    // 将对象转化为json字符串
    accessToken = JSON.stringify(accessToken);
    return new Promise((resolve, reject) => {
      writeFile("./accessToken.txt", accessToken, err => {
        if (!err) {
          console.log("文件保存成功")
        } else {
          reject("saveAccessToken方法出了问题：" + err)
        }
      })
    })

  }

  readAccessToken() {
    return new Promise((resolve, reject) => {
      readFile("./accessToken.txt", (err, data) => {
        if (!err) {
          console.log("文件读取成功")
          data = JSON.parse(data);
          resolve(data)
        } else {
          reject("saveAccessToken方法出了问题：" + err)
        }
      })
    })
  }

  isValidAccessToken(data) {
    if (!data && !data.access_token && data.expires_in) {
      return false;
    }
    return data.expires_in > Date.now()
  }
  fetchAccessToken() {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      //说明保存过，并且有效
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }
    return this.readAccessToken()
      .then(async res => {
        //本地有文件
        //判断是否过期
        if (this.isValidAccessToken(res)) {
          //有效的
          return Promise.resolve(res)
          // resolve(res);
        } else {
          //过期了
          //发送请求获取
          const res = await this.getAccessToken()
          await this.saveAccessToken()
          return Promise.resolve(res)
          // resolve(res)
        }
      }).catch(async err => {
        //过期了
        //发送请求获取
        const res = await this.getAccessToken()
        await this.saveAccessToken()
        return Promise.resolve(res)
      }).then(res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        //返货res包装
        return Promise.resolve(res)
      })
  }

  createMenu(){
    return new Promise(async (resolve,reject)=>{
      //获取access_token
      const data = await this.fetchAccessToken();
      const url =``

    })
  }
}

module.exports = Wechat