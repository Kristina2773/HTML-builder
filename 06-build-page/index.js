const fs = require('fs');
const path = require('path');

async function createFolder() {
  await fs.promises.rm(path.join(__dirname,'project-dist'), {recursive: true, force: true});
  await fs.promises.mkdir(path.join(__dirname,'project-dist'), {recursive: true});
}

async function copyFolder(baseFolder, folder) {
  await fs.promises.rm(folder, {recursive: true, force: true});
  await fs.promises.mkdir(folder, {recursive: true});
  let files = await fs.promises.readdir(baseFolder, {withFileTypes: true});

    for (let file of files) {
      let fileFolder = path.join(baseFolder, file.name);
      let fileCopy = path.join(folder, file.name);
      if (file.isDirectory()) {
        await copyFolder(fileFolder, fileCopy);
      } else {
        await fs.promises.copyFile(fileFolder, fileCopy);
      }
    }
  }

async function readAndCopy() {
  const readFolder = path.join(__dirname, 'styles');
  const info = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
}

async function formHTML() {
  const readFile = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  let components = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  let data = '';
  readFile.on('data', chunk => data += chunk);
  readFile.on('end', async () => {
    for (let component of components) {
      if (component.isFile() === true) {
        const readComponent = fs.createReadStream(path.join(__dirname, 'components', component.name), 'utf-8');
        let componentFileName = component.name.split('.')[0]; 
        let componentData = '';
        readComponent.on('data', chunk => componentData += chunk);
        readComponent.on('end', () => {
          let regexp = new RegExp(`{{${componentFileName}}}`);
          data = data.replace(regexp, componentData);
          const infoHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
          infoHtml.write(data);
        });
      }
    }
  });
}

async function bundleProject() {
  await createFolder();
  await copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await formHTML();
  await readAndCopy();
}
bundleProject();