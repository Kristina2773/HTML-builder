const fs = require('fs');
const path = require('path');

async function copyFolder(baseFolder, folder) {
  await fs.promises.rm(folder, {
    recursive: true,
    force: true
  });
  await fs.promises.mkdir(folder, {
    recursive: true
  });
  let files = await fs.promises.readdir(baseFolder, {
    withFileTypes: true
  });

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

copyFolder(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));