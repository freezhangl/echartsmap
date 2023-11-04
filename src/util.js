export default function(){
  const fs = require('fs')
const files = fs.readdirSync(__dirname)

for (const file of files) {
  if (file.endsWith('.md')) {
    fs.mkdirSync(
      __dirname + '/' + file.replace('.md', ''),
      { recursive: true },
      (err) => {
        console.log(err)
      }
    )

    fs.renameSync(
      __dirname + '/' + file,
      __dirname + '/' + file.replace('.md', '') + '/index.md',
      (err) => {
        console.log(err)
      }
    )
  }
}
}