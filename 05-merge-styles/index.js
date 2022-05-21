const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'project-dist');
const readFolder = path.join(__dirname, 'styles');
const info = fs.createWriteStream(path.join(folder, 'bundle.css'));

fs.readdir(readFolder, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  for (const file of files) {
    let fileReadFolder = path.join(readFolder, file.name);
    if (file.isFile() && path.extname(fileReadFolder) === '.css') {
      const array = [];
      let readFile = fs.createReadStream(fileReadFolder, 'utf-8');
      readFile.on('data', chunk => array.push(chunk));
      readFile.on('end', () => {
        for(let i = 0; i < array.length; i++) {
          info.write(`${array[i]}\n`);
        }
      });
    }
  }
});
