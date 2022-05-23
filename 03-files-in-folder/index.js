const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');
fs.readdir(folder, {
  withFileTypes: true
}, (err, files) => {
  if (err) {
    console.log(err);
  }
  let arr = [];
  for (const file of files) {
    if (file.isFile()) {
      arr.push(file.name);
    } else {
      continue;
    }
  }
  for (let i = 0; i < arr.length; i++) {
    const name = arr[i].split('.');
    const p = path.join(folder, `${arr[i]}`);
    fs.stat(p, (err, stats) => {
      if (err) {
        console.log(err);
      }
      console.log(`${name[0]} - ${path.extname(arr[i])} - ${stats.size}`);
    });
  }
})