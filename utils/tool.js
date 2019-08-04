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
  }
}