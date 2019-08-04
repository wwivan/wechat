const {
  parseString
} = require('xml2js');
module.exports = {
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = '';
      req
        .on('data', data => {
          //当流式数据传递过来时，会触发当前事件，会将数据注入到回调函数中
          // console.log(data.toString());
          //读取的数据是buffer，需要将其转化成字符串
          xmlData += data.toString();
        })
        .on('end', () => {
          console.log('end');
          //当数据接受完毕时，会触发当前
          resolve(xmlData);
        })
    })
  },
  parseXmlAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, {
        trim: true
      }, (err, data) => {
        if (!err) {
          //解析成功了
          resolve(data);
        } else {
          //解析失败了
          reject("parseXmlAsync方法出了问题：" + err)
        }
      })
    })
  },
  formatMessage(jsData) {
    const data = jsData.xml;
    let message = {};
    if (typeof data === "object") {
      //循环遍历对象中的所有数据
      for (let key in data) {
        //获取属性值
        let value = data[key];
        if (Array.isArray(value) && value.length > 0) {
          //在新对象中添加属性值
          message[key] = value[0]
        }
      }
    }
    return message
  }
}