  const fs = require('fs')
// const files = fs.readdirSync(__dirname)
const files = fs.readdirSync('public/aliyun')
// const files = fs.readdirSync('src')
for (const file of files) {
  if (file.includes('暗黑风')) {
    // if (file.includes('你好吗')) {
  console.log(file,'我是每一个')
// console.log(file,'粉底好', __dirname + '/' + file,__dirname + '/' + file.replace('_full', ''))

    // fs.mkdirSync(
    //   __dirname + '/' + file.replace('_full', ''),
    //   { recursive: true },
    //   (err) => {
    //     console.log(err)
    //   }
    // )

    fs.renameSync(
      'public/aliyun/' + file,
      'public/aliyun/' + file.replace('暗黑风', ''),
      (err) => {
        console.log(err)
      }
    )
  }
}